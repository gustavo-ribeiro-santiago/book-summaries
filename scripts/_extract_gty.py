import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Getting to Yes*')[0]
book = epub.read_epub(epub_path)

outdir = r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\getting-to-yes'
os.makedirs(outdir, exist_ok=True)

chapters = [
    ('prefaces',      ['text/part0006.html', 'text/part0007.html']),
    ('introduction',  ['text/part0010.html']),
    ('chapter_01',    ['text/part0011.html', 'text/part0012.html']),
    ('chapter_02',    ['text/part0013.html', 'text/part0014.html']),
    ('chapter_03',    ['text/part0015.html']),
    ('chapter_04',    ['text/part0016.html']),
    ('chapter_05',    ['text/part0017.html']),
    ('chapter_06',    ['text/part0018.html', 'text/part0019.html']),
    ('chapter_07',    ['text/part0020.html']),
    ('chapter_08',    ['text/part0021.html']),
    ('conclusion',    ['text/part0022.html', 'text/part0023.html']),
    ('ten_questions', ['text/part0024.html', 'text/part0025.html']),
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
