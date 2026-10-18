"""Rebuild the downloadable text CV from the same source as its HTML page."""
from pathlib import Path
import json
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4

root = Path(__file__).resolve().parent
cv = json.loads((root / 'cv-content.json').read_text(encoding='utf-8'))
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Name', fontName='Helvetica-Bold', fontSize=25, leading=29, textColor=HexColor('#237c7c'), spaceAfter=8))
styles.add(ParagraphStyle(name='Copy', fontName='Helvetica', fontSize=9, leading=12, spaceAfter=6))
styles.add(ParagraphStyle(name='Section', fontName='Helvetica-Bold', fontSize=13, leading=17, spaceBefore=10, spaceAfter=6, textColor=HexColor('#237c7c')))
styles.add(ParagraphStyle(name='Job', fontName='Helvetica-Bold', fontSize=10, leading=13, spaceAfter=3))
def para(s, style='Copy'):
    return Paragraph(escape(s), styles[style])
story = [para('MATTHEW BRADLEY', 'Name'), para('SCULPTING | MODELS | PROPS'), para('mgbradley.uk@gmail.com | https://mgbradley.uk | North Somerset, UK'), para('Experience and qualifications from the 2024 CV. Contact Matthew for current availability and latest experience.'), Spacer(1, 4), para('About', 'Section'), para(cv['about'])]
for section in cv['sections']:
    story.append(para(section['heading'], 'Section'))
    for e in section['entries']:
        story.append(KeepTogether([para(e['title'] + ' (' + e['date'] + ')', 'Job'), para(e['text'])]))
story.extend([para('Skills', 'Section'), para('; '.join(cv['skills']) + '.')])
doc = SimpleDocTemplate(str(root / 'matthew-bradley-cv.pdf'), pagesize=A4, rightMargin=42, leftMargin=42, topMargin=36, bottomMargin=36, title='Matthew Bradley | CV', author='Matthew Bradley')
doc.build(story)
print('Built downloadable text CV')
