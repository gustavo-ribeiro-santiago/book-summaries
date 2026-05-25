import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Zero to One*')[0]
book = epub.read_epub(epub_path)

outdir = r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\zero-to-one'
os.makedirs(outdir, exist_ok=True)

def decode_text(t):
    return ''.join(chr(ord(c) + 29) for c in t)

# Gather all paragraphs from both content files
all_paras = []
for href in ['index_split_000.html', 'index_split_001.html']:
    item = book.get_item_with_href(href)
    raw = item.get_content()
    soup = BeautifulSoup(raw, 'html.parser')
    for tag in soup.find_all(['p', 'div']):
        t = decode_text(tag.get_text(strip=True))
        if len(t) > 3:
            all_paras.append(t)

# Chapter boundaries (start paragraph index, inclusive)
chapters = [
    ('preface',     43,   82),
    ('chapter_01',  83,  171),
    ('chapter_02', 172,  333),
    ('chapter_03', 334,  512),
    ('chapter_04', 513,  662),
    ('chapter_05', 663,  895),
    ('chapter_06', 896, 1227),
    ('chapter_07', 1228, 1365),
    ('chapter_08', 1366, 1601),
    ('chapter_09', 1602, 1783),
    ('chapter_10', 1784, 1910),
    ('chapter_11', 1911, 2137),
    ('chapter_12', 2138, 2322),
    ('chapter_13', 2323, 2597),
    ('chapter_14', 2598, 2789),
    ('conclusion', 2790, len(all_paras) - 1),
]

for key, start, end in chapters:
    paras = all_paras[start:end + 1]
    # Replace '=' with space and clean up
    content = '\n\n'.join(p.replace('=', ' ') for p in paras)
    outpath = os.path.join(outdir, f'{key}.txt')
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'{key}: {len(content)} chars ({end - start + 1} paragraphs)')
