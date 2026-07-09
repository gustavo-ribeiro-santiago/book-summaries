import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Sapiens*')[0]
book = epub.read_epub(epub_path)

outdir = r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\sapiens'
os.makedirs(outdir, exist_ok=True)

base = 'OEBPS/Hara_9780771038525_epub_'

chapters = []
for i in range(1, 21):
    chapters.append((f'chapter_{i:02d}', [f'{base}c{i:02d}_r1.htm']))
chapters.append(('afterword', [f'{base}aft_r1.htm']))

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
