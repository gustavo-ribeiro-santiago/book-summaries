import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Flow*')[0]
book = epub.read_epub(epub_path)

outdir = r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\flow'
os.makedirs(outdir, exist_ok=True)

chapters = [
    ('preface',    ['pre01.xhtml']),
    ('chapter_01', ['ch01.xhtml', 'cha01.xhtml', 'cha02.xhtml', 'cha03.xhtml',
                    'cha04.xhtml', 'cha05.xhtml', 'cha06.xhtml']),
    ('chapter_02', ['ch02.xhtml', 'cha07.xhtml', 'cha08.xhtml', 'cha09.xhtml',
                    'cha10.xhtml', 'cha11.xhtml', 'cha12.xhtml']),
    ('chapter_03', ['ch03.xhtml', 'cha13.xhtml', 'cha14.xhtml', 'cha15.xhtml']),
    ('chapter_04', ['ch04.xhtml', 'cha16.xhtml', 'cha17.xhtml', 'cha18.xhtml', 'cha19.xhtml']),
    ('chapter_05', ['ch05.xhtml', 'cha20.xhtml', 'cha21.xhtml', 'cha22.xhtml',
                    'cha23.xhtml', 'cha24.xhtml', 'cha25.xhtml', 'cha26.xhtml']),
    ('chapter_06', ['ch06.xhtml', 'cha27.xhtml', 'cha28.xhtml', 'cha29.xhtml',
                    'cha30.xhtml', 'cha31.xhtml', 'cha32.xhtml', 'cha33.xhtml', 'cha34.xhtml']),
    ('chapter_07', ['ch07.xhtml', 'cha35.xhtml', 'cha36.xhtml', 'cha37.xhtml', 'cha38.xhtml']),
    ('chapter_08', ['ch08.xhtml', 'cha39.xhtml', 'cha40.xhtml', 'cha41.xhtml',
                    'cha42.xhtml', 'cha43.xhtml', 'cha44.xhtml']),
    ('chapter_09', ['ch09.xhtml', 'cha45.xhtml', 'cha46.xhtml', 'cha47.xhtml', 'cha48.xhtml']),
    ('chapter_10', ['ch10.xhtml', 'cha49.xhtml', 'cha50.xhtml', 'cha51.xhtml',
                    'cha52.xhtml', 'cha53.xhtml']),
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
