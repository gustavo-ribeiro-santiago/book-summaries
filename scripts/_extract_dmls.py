import glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

epub_path = glob.glob(r'c:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Designing*')[0]
book = epub.read_epub(epub_path)

outdir = r'c:\Users\gusta\Documents\My GitHub\book-summaries\scripts\designing-ml-systems'
os.makedirs(outdir, exist_ok=True)

chapters = [
    ('preface', 'preface01.xhtml'),
    ('chapter_01', 'ch01.xhtml'),
    ('chapter_02', 'ch02.xhtml'),
    ('chapter_03', 'ch03.xhtml'),
    ('chapter_04', 'ch04.xhtml'),
    ('chapter_05', 'ch05.xhtml'),
    ('chapter_06', 'ch06.xhtml'),
    ('chapter_07', 'ch07.xhtml'),
    ('chapter_08', 'ch08.xhtml'),
    ('chapter_09', 'ch09.xhtml'),
    ('chapter_10', 'ch10.xhtml'),
    ('chapter_11', 'ch11.xhtml'),
]

for key, href in chapters:
    item = book.get_item_with_href(href)
    if not item:
        print(f'NOT FOUND: {href}')
        continue
    soup = BeautifulSoup(item.get_content(), 'html.parser')
    paragraphs = []
    for tag in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'li']):
        text = tag.get_text(strip=True)
        if text:
            paragraphs.append(text)
    content = '\n\n'.join(paragraphs)
    outpath = os.path.join(outdir, f'{key}.txt')
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'{key}: {len(content)} chars')
