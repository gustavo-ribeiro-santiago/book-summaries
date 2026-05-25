import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Storytelling*')[0]
book = epub.read_epub(epub_path)

outdir = r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\storytelling-with-data'
os.makedirs(outdir, exist_ok=True)

chapters = [
    ('introduction', ['text00007.html']),
    ('chapter_01',   ['text00008.html']),
    ('chapter_02',   ['text00009.html']),
    ('chapter_03',   ['text00010.html']),
    ('chapter_04',   ['text00011.html']),
    ('chapter_05',   ['text00012.html']),
    ('chapter_06',   ['text00013.html']),
    ('chapter_07',   ['text00014.html']),
    ('chapter_08',   ['text00015.html']),
    ('chapter_09',   ['text00016.html']),
    ('chapter_10',   ['text00017.html']),
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
