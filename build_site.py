"""Build the portfolio's checked-in HTML and responsive images.

Run: python build_site.py (requires Pillow). No cloud build command is needed.
Project copy stays in feature-project.json; every output is served as static HTML.
"""
from pathlib import Path
from html import escape
import hashlib
import json
import re
import unicodedata
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
SITE = 'https://mgbradley.uk'
EMAIL = 'mgbradley.uk@gmail.com'
PROJECTS = json.loads((ROOT / 'feature-project.json').read_text(encoding='utf-8'))
CATEGORIES = [c for c in json.loads((ROOT / 'feature-project-category.json').read_text(encoding='utf-8')) if c['id'] <= 4]
MANIFEST = {}
ASSET_VERSIONS = {
    asset: hashlib.sha256((ROOT / asset).read_text(encoding='utf-8').encode()).hexdigest()[:12]
    for asset in ('portfolio.css', 'portfolio.js')
}

def clean(value):
    return str(value or '').replace('\u2014', ', ').replace('\u2013', ' to ').replace('commision', 'commission')

def h(value):
    return escape(clean(value), quote=True)

def slug(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', value).strip('-')

def name(p):
    return clean(p['feature-project-name'])

def route(p):
    return '/projects/' + slug(name(p))

def catroute(c):
    return '/categories/' + slug(c['categoryName'])

def write(path, content):
    dest = ROOT / path
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(content, encoding='utf-8', newline='\n')

def image_data(source):
    if source in MANIFEST:
        return MANIFEST[source]
    path = ROOT / source
    with Image.open(path) as original:
        im = ImageOps.exif_transpose(original).convert('RGB')
        width, height = im.size
        base = slug(Path(source).stem) + '-' + hashlib.sha256(path.read_bytes() + b'webp-q80-v1').hexdigest()[:8]
        versions = []
        for size in sorted(set(min(width, w) for w in (480, 960, 1600))):
            output = f'assets/optimized/{base}-{size}.webp'
            dest = ROOT / output
            dest.parent.mkdir(parents=True, exist_ok=True)
            if not dest.exists() or dest.stat().st_mtime < path.stat().st_mtime:
                resized = im.copy()
                resized.thumbnail((size, round(height * size / width)), Image.Resampling.LANCZOS)
                resized.save(dest, 'WEBP', quality=80, method=6)
            versions.append((size, '/' + output))
    MANIFEST[source] = {'width': width, 'height': height, 'versions': versions}
    return MANIFEST[source]

def img(source, alt, eager=False, sizes='(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw', cls='', position=None):
    d = image_data(source)
    src = d['versions'][min(1, len(d['versions']) - 1)][1]
    srcset = ', '.join(f'{url} {w}w' for w, url in d['versions'])
    focal_style = f' style="object-position:{h(position)}"' if position else ''
    return f'<img src="{src}" srcset="{srcset}" sizes="{sizes}" width="{d["width"]}" height="{d["height"]}" alt="{h(alt)}" loading="{"eager" if eager else "lazy"}" decoding="async" {"fetchpriority=\"high\"" if eager else ""} class="{cls}"{focal_style}>'

def year(p):
    a, b = p.get('feature-project-start-year'), p.get('feature-project-end-year')
    return str(a or '') if not b or a == b else f'{a} to {b}'

def nav(path='/'):
    markup = '''<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><nav aria-label="Main navigation">
<a class="brand" href="/" aria-label="Matthew Bradley, home"><img src="/Header.png" width="1500" height="236" alt="Matthew Bradley: sculpting, models and props"></a>
<button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links" hidden>Menu <span aria-hidden="true">☰</span></button>
<div class="nav-links" id="nav-links"><a href="/">Home</a><a href="/#projects-container">Projects</a><a href="/#contact">Contact</a><a class="button" href="/#cv-portfolio">CV / Portfolio</a></div>
</nav></header>'''
    if path == '/':
        markup = markup.replace('<a href="/">Home', '<a href="/" aria-current="page">Home')
    elif path == '/portfolio-cv':
        markup = markup.replace('href="/#cv-portfolio">', 'href="/#cv-portfolio" aria-current="location">')
    elif path.startswith(('/projects/', '/categories/')):
        markup = markup.replace('href="/#projects-container">Projects', 'href="/#projects-container" aria-current="location">Projects')
    return markup

def socials():
    return '''<div class="social-links" aria-label="Social profiles"><a href="https://www.instagram.com/m.g.b_artwork/">Instagram</a><a href="https://www.youtube.com/channel/UCjNBnhekbjApHw49ZqEiMlw">YouTube</a><a href="https://www.linkedin.com/in/matthew-bradley-a59811267">LinkedIn</a></div>'''

def page(title, description, path, body, photo='feature-img-beta/feature-1.jpg', schema=None, noindex=False):
    share = SITE + image_data(photo)['versions'][-1][1]
    structured = {'@context': 'https://schema.org', '@type': 'Person', '@id': SITE + '/#matthew', 'name': 'Matthew Bradley', 'url': SITE + '/', 'jobTitle': 'Model and prop maker', 'sameAs': ['https://www.instagram.com/m.g.b_artwork/', 'https://www.linkedin.com/in/matthew-bradley-a59811267']}
    if schema:
        structured = {'@context': 'https://schema.org', '@graph': [structured, schema]}
    return f'''<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{h(title)}</title><meta name="description" content="{h(description)}"><link rel="canonical" href="{SITE}{path}">
<meta property="og:type" content="website"><meta property="og:title" content="{h(title)}"><meta property="og:description" content="{h(description)}"><meta property="og:url" content="{SITE}{path}"><meta property="og:image" content="{share}"><meta property="og:image:alt" content="{h(title)}"><meta property="og:site_name" content="Matthew Bradley"><meta property="og:locale" content="en_GB"><meta name="twitter:card" content="summary_large_image">
{'<meta name="robots" content="noindex, follow">' if noindex else ''}
<meta name="theme-color" content="#237c7c"><link rel="icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="stylesheet" href="/portfolio.css?v={ASSET_VERSIONS['portfolio.css']}"><script src="/portfolio.js?v={ASSET_VERSIONS['portfolio.js']}" defer></script>
<script type="application/ld+json">{json.dumps(structured, ensure_ascii=False).replace('<', '\\u003c')}</script></head>
<body>{nav(path)}<main id="main" tabindex="-1">{body}</main><footer><p>Matthew Bradley © <span data-year>2026</span>. All rights reserved.</p><a href="mailto:{EMAIL}">{EMAIL}</a>{socials()}<a class="back-top" href="#main">Back to top ↑</a></footer></body></html>'''

def card(p):
    category = next(c for c in CATEGORIES if c['id'] == p['project-feature-main-category-id'])
    search = ' '.join([name(p), p['feature-project-description'], category['categoryName'], ' '.join(p.get('feature-project-skills') or []), p.get('feature-project-company-name') or '', p.get('feature-project-client') or ''])
    return f'''<article class="project-card" data-category="{category['id']}" data-featured="{str(p.get('feature-project-type') == 'highlighted').lower()}" data-search="{h(search)}"><a href="{route(p)}">{img(p.get('feature-project-card-image') or p['feature-project-thumbnail'], p.get('feature-project-card-alt') or name(p), position=p.get('feature-project-card-position'))}<div class="card-copy"><p class="card-category">{h(category['categoryName'])}</p><h3>{h(name(p))}</h3><p class="card-description">{h(p['feature-project-description'])}</p><div class="card-footer"><span class="year">{h(year(p))}</span><span class="card-action">View project <span aria-hidden="true">↗</span></span></div></div></a></article>'''

def testimonial(p):
    items = [t for t in p.get('feature-project-testimonial', []) if t.get('testimonial-quote')]
    return ''.join(f'<figure class="testimonial"><blockquote>{h(t["testimonial-quote"])}</blockquote><figcaption>{h(t.get("testimonial-name"))}<br>{h(t.get("testimonial-role") or t.get("testimonial-employer-name"))}</figcaption></figure>' for t in items)

def cv_sections(cv, level=2):
    heading, entry = f'h{level}', f'h{level + 1}'
    sections = ''.join(f'<section><{heading}>{h(s["heading"])}</{heading}>' + ''.join(f'<{entry}>{h(e["title"])}</{entry}><p class="cv-date">{h(e.get("date"))}</p><p>{h(e["text"])}</p>' for e in s['entries']) + '</section>' for s in cv['sections'])
    return f'<section><{heading}>About</{heading}><p>{h(cv["about"])}</p></section>{sections}<section><{heading}>Skills</{heading}><ul class="skills">{"".join("<li>"+h(s)+"</li>" for s in cv["skills"])}</ul></section>'

def home_cv():
    cv = json.loads((ROOT / 'cv-content.json').read_text(encoding='utf-8'))
    return f'''<section class="section home-cv" id="cv-portfolio" aria-labelledby="cv-heading"><div class="cv-panel"><div class="section-heading"><p class="eyebrow">Experience &amp; selected work</p><h2 id="cv-heading">CV &amp; Portfolio</h2><p>Explore my experience, qualifications and practical skills, or download a copy to keep.</p></div><div class="cv-downloads"><a class="download-card" href="/matthew-bradley-cv.pdf" download><span class="download-label">CV · PDF</span><strong>Experience &amp; skills</strong><span>Download CV ↓</span></a><a class="download-card" href="/matthew-bradley-2024-portfolio.pdf" download><span class="download-label">Portfolio · PDF</span><strong>A closer look at my work</strong><span>Download portfolio ↓</span></a></div><p class="source-note">Experience and qualifications from my 2024 CV. Please contact me for current availability and my latest experience.</p><details class="cv-details"><summary>Read my CV on this page</summary><div class="cv-content">{cv_sections(cv, 3)}</div></details></div></section>'''

def homepage():
    banner = json.loads((ROOT / 'first-impression-banner.json').read_text(encoding='utf-8'))
    slides = ''
    for i, b in enumerate(banner):
        pid = int(b['first-impression-project-link'].split('=')[-1])
        p = next(p for p in PROJECTS if p['id'] == pid)
        slides += f'<a class="ribbon-slide" href="{route(p)}">{img(b["first-impression-image"], name(p), i == 0, "(max-width: 600px) 80vw, 350px")}<span>{h(name(p))}</span></a>'
    featured = sorted([p for p in PROJECTS if p.get('feature-project-type') == 'highlighted'], key=lambda p:p.get('feature-project-order') or 0)
    ordered = featured + [p for p in PROJECTS if p not in featured]
    filter_names = {1:'Puppets & models', 2:'Sculpting & casting', 3:'Props & sets', 4:'Woodworking'}
    filters = ''.join(f'<button class="filter-chip" type="button" data-filter="{c["id"]}" aria-pressed="false">{filter_names[c["id"]]}</button>' for c in CATEGORIES)
    body = f'''<section class="intro" id="home"><p class="eyebrow">Sculpting · Models · Props</p><h1>Matthew Bradley<br><span>Model &amp; Prop Maker</span></h1><p class="lead">Based in North Somerset, creating stop-motion puppets, sculptures, props and scale models for film, television and independent projects.</p><div class="actions"><a class="button" href="#projects-container">View selected work</a><a class="button outline" href="#contact">Discuss a project</a><a class="text-link" href="#cv-portfolio">CV &amp; Portfolio</a></div></section>
<section class="ribbon-section" aria-label="Portfolio highlights"><div class="ribbon" id="portfolio-ribbon">{slides}</div><div class="ribbon-tools" hidden><button class="ribbon-arrow" type="button" data-ribbon-prev aria-label="Previous highlights" aria-controls="portfolio-ribbon">←</button><button class="ribbon-control" type="button" aria-controls="portfolio-ribbon" aria-pressed="false">Play slideshow</button><button class="ribbon-arrow" type="button" data-ribbon-next aria-label="Next highlights" aria-controls="portfolio-ribbon">→</button></div></section>
<section class="section about"><h2>Craftsmanship, character and imagination</h2><p>I am a model and prop maker with a keen affinity for sculpting. I have a lifelong love of stop-motion animation and its associated artistry, alongside interests in history, Tolkienesque fantasy and English folklore. These passions come together in my creations wherever possible.</p></section>
<section class="section" id="projects-container"><div class="section-heading"><p class="eyebrow">The portfolio</p><h2>From puppet fabrication to miniature worlds</h2><p>Explore finished pieces and the craft behind them.</p></div><div class="project-browser" hidden><div class="project-search"><label for="project-search">Find a project</label><div class="search-row"><input type="search" id="project-search" placeholder="Try puppets, BBC or silicone" autocomplete="off" aria-controls="project-results"><button type="button" class="clear-search" hidden>Clear search</button></div></div><div class="project-filters" role="group" aria-label="Filter projects by specialism"><button class="filter-chip" type="button" data-filter="featured" aria-pressed="true">Selected work</button><button class="filter-chip" type="button" data-filter="all" aria-pressed="false">All projects ({len(PROJECTS)})</button>{filters}</div><p class="project-count" role="status" aria-live="polite" aria-atomic="true"></p></div><div class="project-grid" id="project-results">{''.join(card(p) for p in ordered)}</div><div class="no-results" hidden><h3>No matching projects</h3><p>Try another word or browse the complete portfolio.</p><button class="button outline" type="button" data-reset-projects>Show all projects</button></div></section>
<section class="section testimonial-section" aria-label="Client feedback"><h2>Working with Matthew</h2>{testimonial(PROJECTS[0])}</section>
<section class="section"><h2>Explore by specialism</h2><div class="category-grid">{''.join(f'<a class="category-card" href="{catroute(c)}"><h3>{h(c["categoryName"])}</h3><p>{h(c["description"])}</p><span>{sum(p.get("project-feature-main-category-id") == c["id"] for p in PROJECTS)} projects →</span></a>' for c in CATEGORIES)}</div></section>
{home_cv()}
<section class="section contact" id="contact"><div><p class="eyebrow">Get in touch</p><h2>Have a project in mind?</h2><p>For project enquiries, collaborations or further information about my work, send a message or email me directly.</p><a class="email" href="mailto:{EMAIL}">{EMAIL}</a><p>North Somerset, UK</p>{socials()}</div><form action="https://formsubmit.co/{EMAIL}" method="POST"><input type="hidden" name="_next" value="{SITE}/thank-you"><input type="hidden" name="_subject" value="Website project enquiry"><input type="text" name="_honey" tabindex="-1" autocomplete="off" class="honeypot" aria-hidden="true"><label for="contactName">Full name</label><input id="contactName" name="name" autocomplete="name" required><label for="contactEmail">Email address</label><input id="contactEmail" name="email" type="email" autocomplete="email" required><label for="contactMessage">Your message</label><textarea id="contactMessage" name="message" rows="6" required></textarea><p class="form-note">Your name, email and message are sent through FormSubmit so Matthew can respond to your enquiry.</p><button class="button" type="submit">Send message</button></form></section>'''
    write('index.html', page('Matthew Bradley | Model & Prop Maker in North Somerset', 'Model and prop maker in North Somerset. Explore Matthew Bradley’s stop-motion puppets, sculptures, film props and scale models, or discuss a project.', '/', body))

def project_pages():
    captions = json.loads((ROOT / 'image-descriptions.json').read_text(encoding='utf-8')) if (ROOT / 'image-descriptions.json').exists() else {}
    for p in PROJECTS:
        title = name(p)
        gallery = ''
        for i, g in enumerate(p.get('feature-project-gallery') or []):
            alt = captions.get(g['image']) or g.get('alt-text') or f'{title}, portfolio photograph {i + 1}'
            # Every thumbnail remains a normal full-resolution link without JavaScript.
            gallery += f'<figure><a class="gallery-link" href="/{h(g["image"])}" data-caption="{h(alt)}">{img(g["image"], alt)}<span class="gallery-expand" aria-hidden="true">View photo ↗</span></a><figcaption>{h(g.get("description") or alt)}</figcaption></figure>'
        facts = [('Role', p.get('feature-project-job-category')), ('Company', p.get('feature-project-company-name')), ('Client', p.get('feature-project-client')), ('Skills', ', '.join(p.get('feature-project-skills') or []))]
        facts_html = ''.join(f'<div><dt>{k}</dt><dd>{h(v)}</dd></div>' for k,v in facts if v)
        videos = p.get('feature-project-youtube-link') or []
        video_html = ''
        for v in videos:
            if isinstance(v, dict) and re.match(r'https://(www\.)?(youtube(-nocookie)?\.com|youtu\.be)/', v.get('url', '')):
                video_html += f'<section class="video"><h3>{h(v.get("title") or title)}</h3><iframe src="{h(v["url"])}" title="{h(v.get("title") or title)}" loading="lazy" allowfullscreen></iframe><p>{h(v.get("description"))}</p></section>'
        related = [q for q in PROJECTS if q['id'] != p['id'] and q.get('project-feature-main-category-id') == p.get('project-feature-main-category-id')][:3]
        body = f'''<article class="section project"><a class="back-link" href="/#projects-container">← All projects</a><header class="project-heading"><p class="eyebrow">{h(year(p))}</p><h1>{h(title)}</h1></header><div class="project-intro">{img(p['feature-project-thumbnail'], title, True, '(max-width: 750px) 100vw, 55vw', 'project-cover')}<div><p class="lead">{h(p['feature-project-long-description'])}</p><dl class="project-facts">{facts_html}</dl><a class="button" href="/#contact">Discuss a project</a></div></div>{'<section class="project-gallery"><h2>Gallery</h2><p>Select a photograph to view it in full.</p><div class="gallery-grid">' + gallery + '</div></section>' if gallery else ''}{video_html}{'<section><h2>Client feedback</h2>' + testimonial(p) + '</section>' if p.get('feature-project-testimonial') else ''}{'<section class="related"><h2>Related projects</h2><div class="project-grid">' + ''.join(card(q) for q in related) + '</div></section>' if related else ''}</article>'''
        category = next(c for c in CATEGORIES if c['id'] == p['project-feature-main-category-id'])
        breadcrumb = f'<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/#projects-container">All projects</a><span aria-hidden="true">/</span><a href="{catroute(category)}">{h(category["categoryName"])}</a></nav>'
        body = body.replace('<a class="back-link" href="/#projects-container">← All projects</a>', breadcrumb)
        if gallery:
            body = body.replace('</h1></header>', f'</h1><a class="gallery-jump" href="#gallery">View {len(p.get("feature-project-gallery") or [])} photographs ↓</a></header>')
            body = body.replace('<section class="project-gallery">', '<section class="project-gallery" id="gallery">')
        desc = clean(p['feature-project-description'])
        schema = {'@type':'CreativeWork', 'name':title, 'description':desc, 'url':SITE+route(p), 'creator':{'@id':SITE+'/#matthew'}, 'image':SITE+image_data(p['feature-project-thumbnail'])['versions'][-1][1]}
        write(route(p).lstrip('/') + '.html', page(title + ' | Matthew Bradley', desc, route(p), body, p['feature-project-thumbnail'], schema))
    for c in CATEGORIES:
        members = [p for p in PROJECTS if p.get('project-feature-main-category-id') == c['id']]
        body = f'<section class="section"><a class="back-link" href="/#projects-container">← All projects</a><h1>{h(c["categoryName"])}</h1><p class="lead">{h(c["description"])}</p><h2>Projects</h2><div class="project-grid">{"".join(card(p) for p in members)}</div></section>'
        write(catroute(c).lstrip('/')+'.html', page(c['categoryName']+' | Matthew Bradley', c['description'], catroute(c), body, members[0]['feature-project-thumbnail']))

def cv_page():
    cv = json.loads((ROOT / 'cv-content.json').read_text(encoding='utf-8'))
    body = f'<article class="section cv"><h1>CV &amp; Portfolio</h1><p class="lead">Matthew Bradley, model and prop maker</p><div class="actions"><a class="button" href="/matthew-bradley-cv.pdf" download>Download CV (PDF)</a><a class="button outline" href="/matthew-bradley-2024-portfolio.pdf">View portfolio (PDF)</a></div><p class="source-note">Experience and qualifications from my 2024 CV. Please contact me for current availability and my latest experience.</p>{cv_sections(cv)}<p><a href="mailto:{EMAIL}">{EMAIL}</a> · <a href="/#contact">Discuss a project</a></p></article>'
    write('portfolio-cv.html', page('CV & Portfolio | Matthew Bradley, Model & Prop Maker', 'Read Matthew Bradley’s experience, qualifications and skills in model making, sculpting and prop fabrication. Download his CV and portfolio.', '/portfolio-cv', body))

def support_pages():
    write('thank-you.html', page('Thank you | Matthew Bradley', 'Thank you for your project enquiry.', '/thank-you', f'<section class="section narrow"><h1>Thank you for getting in touch</h1><p>Your enquiry has been submitted. If you need to follow up, email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p><a class="button" href="/">Back to the portfolio</a></section>', noindex=True))
    write('404.html', page('Page not found | Matthew Bradley', 'Find Matthew Bradley’s portfolio and contact details.', '/404', '<section class="section narrow"><h1>That page could not be found</h1><p>Explore the portfolio or get in touch about a project.</p><a class="button" href="/">View the portfolio</a></section>', noindex=True))
    urls = ['/', '/portfolio-cv'] + [route(p) for p in PROJECTS] + [catroute(c) for c in CATEGORIES]
    write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '\n'.join(f'<url><loc>{SITE}{h(u)}</loc></url>' for u in urls) + '\n</urlset>\n')
    write('robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: '+SITE+'/sitemap.xml\n')
    routes = {'projects':{str(p['id']):route(p) for p in PROJECTS}, 'categories':{str(c['id']):catroute(c) for c in CATEGORIES}}
    write('project-routes.json', json.dumps(routes, indent=2)+'\n')
    write('_redirects', '/index.html / 301\n/index2.html / 301\n/test.html / 301\n/test2.html / 301\n/feature-project.html /#projects-container 301\n')
    write('_headers', '/assets/optimized/*\n  Cache-Control: public, max-age=31536000, immutable\n/test*\n  X-Robots-Tag: noindex\n')
    # Legacy URLs still work on static hosts, with real links when scripting is disabled.
    links = ''.join(f'<li><a href="{route(p)}">{h(name(p))}</a></li>' for p in PROJECTS)
    fallback = '<section class="section"><h1>Project portfolio</h1><p>Select a project below.</p><ul>'+links+'</ul></section><script src="/legacy-project.js" defer></script>'
    write('details.html', page('Projects | Matthew Bradley', 'Explore Matthew Bradley’s project portfolio.', '/#projects-container', fallback, noindex=True))
    write('legacy-project.js', 'const routes = '+json.dumps(routes)+';\nconst query = new URLSearchParams(location.search);\nconst target = routes.projects[query.get("id")] || routes.categories[query.get("cat")];\nif (target) location.replace(target);\n')

if __name__ == '__main__':
    homepage()
    project_pages()
    cv_page()
    support_pages()
    write('image-manifest.json', json.dumps(MANIFEST, indent=2)+'\n')
    print(f'Built {len(PROJECTS)} projects, {len(CATEGORIES)} categories and supporting pages; {len(MANIFEST)} responsive image sets.')
