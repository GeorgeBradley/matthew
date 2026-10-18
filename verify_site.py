"""Check generated HTML, local references, source data and Pages redirects.

Run python verify_site.py [http://127.0.0.1:8893] while wrangler is running
to additionally check the hosting runtime. This never submits the contact form.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from urllib.request import urlopen, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError
from concurrent.futures import ThreadPoolExecutor
import json, sys, xml.etree.ElementTree as ET

root = Path(__file__).resolve().parent
class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.tags=[]; self.feed(text)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag,dict(attrs)))
    def find(self, tag):
        return [a for t,a in self.tags if t==tag]

pages = [root/'index.html', root/'portfolio-cv.html', root/'thank-you.html', root/'404.html', root/'details.html', *sorted((root/'projects').glob('*.html')), *sorted((root/'categories').glob('*.html'))]
assert len(list((root/'projects').glob('*.html')))==21
assert len(list((root/'categories').glob('*.html')))==4
references=set()
for path in pages:
    text=path.read_text(encoding='utf-8')
    d=Document(text)
    assert len(d.find('h1'))==1, (path,'H1')
    assert len(d.find('title'))==1, (path,'title')
    assert any(m.get('name')=='description' and m.get('content') for m in d.find('meta')),path
    canonical=[m['href'] for m in d.find('link') if m.get('rel')=='canonical']
    assert len(canonical)==1 and canonical[0].startswith('https://mgbradley.uk/'),path
    assert not any(s in text for s in ['mgbbradley.uk@gmail.com','Professional Showcase','\u00c3\u00b3','\u00e2\u20ac','\u2013','\u2014']),path
    for im in d.find('img'):
        assert im.get('alt') and im.get('width') and im.get('height'),(path,im)
        if 'optimized' in im['src']: assert im.get('srcset') and im.get('sizes'),(path,im)
    for tag,attrs in d.tags:
        values=[attrs[k] for k in ('href','src') if k in attrs]
        if 'srcset' in attrs: values += [part.strip().split()[0] for part in attrs['srcset'].split(',')]
        for value in values:
            url=urlsplit(value)
            if url.scheme or url.netloc: continue
            local=(root/unquote(url.path.lstrip('/'))) if url.path.startswith('/') else path.parent/unquote(url.path)
            if not url.path: local=path
            if local.is_dir(): local=local/'index.html'
            if not local.exists() and not local.suffix: local=local.with_suffix('.html')
            assert local.is_file(),(path,value,'missing file')
            if url.fragment and local.suffix=='.html':
                ids={a.get('id') for _,a in Document(local.read_text(encoding='utf-8')).tags}
                assert url.fragment in ids,(path,value,'missing anchor')
            if url.path: references.add(url.path)

data=json.loads((root/'feature-project.json').read_text(encoding='utf-8'))
assert len(data)==21
assert len({p['id'] for p in data})==21
assert all(g.get('alt-text') for p in data for g in p.get('feature-project-gallery',[]))
assert all('feature-20' not in g['image'] for g in data[-1]['feature-project-gallery'])
home=Document((root/'index.html').read_text(encoding='utf-8'))
assert home.find('form')[0]['action']=='https://formsubmit.co/mgbradley.uk@gmail.com'
assert next(a for a in home.find('input') if a.get('name')=='_next')['value']=='https://mgbradley.uk/thank-you'
urls=[n.text for n in ET.parse(root/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert len(urls)==27 and len(set(urls))==27
assert 'Sitemap: https://mgbradley.uk/sitemap.xml' in (root/'robots.txt').read_text()
assert (root/'matthew-bradley-cv.pdf').stat().st_size>1000
print(f'PASS: {len(pages)} pages, 27 sitemap URLs, {len(references)} unique local references, gallery descriptions and contact configuration.')

if len(sys.argv)>1:
    base=sys.argv[1].rstrip('/')
    def check(url):
        with urlopen(base+url,timeout=15) as response:
            assert response.status==200,(url,response.status)
    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(check,sorted(references | {urlsplit(u).path for u in urls})))
    class NoRedirect(HTTPRedirectHandler):
        def redirect_request(self,*args,**kwargs): return None
    opener=build_opener(NoRedirect)
    routes=json.loads((root/'project-routes.json').read_text())
    for key,target in routes['projects'].items():
        for prefix in ('/details?id=','/details.html?id='):
            try: opener.open(base+prefix+key)
            except HTTPError as e:
                assert e.code==301 and e.headers['Location']==base+target,(key,e.code,e.headers)
            else: raise AssertionError('Missing redirect')
    for key,target in routes['categories'].items():
        try: opener.open(base+'/details?cat='+key)
        except HTTPError as e: assert e.code==301 and e.headers['Location']==base+target
        else: raise AssertionError('Missing category redirect')
    for bad in ('/details?id=9999','/not-a-real-project','/details/unknown-project'):
        try: opener.open(base+bad)
        except HTTPError as e: assert e.code==404,(bad,e.code)
        else: raise AssertionError('Missing 404: '+bad)
    for resource,ctype in (('/robots.txt','text/plain'),('/sitemap.xml','xml')):
        with urlopen(base+resource) as response: assert ctype in response.headers['Content-Type']
    print('PASS: HTTP pages/assets, all 46 legacy redirects, unknown URLs and robots/sitemap content types.')
