import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\The Lean*')[0]
book = epub.read_epub(epub_path)

outdir = r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\lean-startup'
os.makedirs(outdir, exist_ok=True)

base = 'OEBPS/Ries_9780307887917_epub_'

chapters = [
    ('introduction', [f'{base}itr_r1.htm']),
    ('chapter_01',   [f'{base}c01_r1.htm']),
    ('chapter_02',   [f'{base}c02_r1.htm']),
    ('chapter_03',   [f'{base}c03_r1.htm']),
    ('chapter_04',   [f'{base}c04_r1.htm']),
    ('chapter_05',   [f'{base}c05_r1.htm']),
    ('chapter_06',   [f'{base}c06_r1.htm']),
    ('chapter_07',   [f'{base}c07_r1.htm']),
    ('chapter_08',   [f'{base}c08_r1.htm']),
    ('chapter_09',   [f'{base}c09_r1.htm']),
    ('chapter_10',   [f'{base}c10_r1.htm']),
    ('chapter_11',   [f'{base}c11_r1.htm']),
    ('chapter_12',   [f'{base}c12_r1.htm']),
    ('epilogue',     [f'{base}c13_r1.htm']),
    ('join_movement',[f'{base}c14_r1.htm']),
]

for key, hrefs in chapters:
    paragraphs = []
    for href in hrefs:
        item = book.get_item_with_href(href)
        if not item:
            print(f'NOT FOUND: {href}')
            continue
        soup = BeautifulSoup(item.get_content(), 'html.parser')
        for tag in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'li']):
            text = tag.get_text(strip=True)
            if text:
                paragraphs.append(text)
    content = '\n\n'.join(paragraphs)
    outpath = os.path.join(outdir, f'{key}.txt')
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'{key}: {len(content)} chars')
