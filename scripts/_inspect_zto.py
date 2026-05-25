import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Zero to One*')[0]
book = epub.read_epub(epub_path)

def decode_text(t):
    return ''.join(chr(ord(c) + 29) for c in t)

# Get all paras from both files combined
all_paras = []
for href in ['index_split_000.html', 'index_split_001.html']:
    item = book.get_item_with_href(href)
    raw = item.get_content()
    soup = BeautifulSoup(raw, 'html.parser')
    for tag in soup.find_all(['p', 'div']):
        t = decode_text(tag.get_text(strip=True))
        if len(t) > 3:
            all_paras.append((href, t))

print(f'Total paragraphs: {len(all_paras)}')

# Look for short all-uppercase-ish lines that could be chapter headers
for i, (href, p) in enumerate(all_paras):
    alpha_chars = [c for c in p if c.isalpha()]
    if not alpha_chars:
        continue
    upper_ratio = sum(1 for c in alpha_chars if c.isupper()) / len(alpha_chars)
    clean_len = len(p.replace('=', '').replace(' ', ''))
    if upper_ratio > 0.75 and 5 < len(p) < 70 and clean_len > 5:
        print(f'{i:4d} [{href[-20:]}]: {repr(p)}')
