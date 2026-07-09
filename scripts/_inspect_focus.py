import sys, glob, ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Focus*')[0]
print('Found:', epub_path)
book = epub.read_epub(epub_path)

for item_id, linear in book.spine:
    item = book.get_item_with_id(item_id)
    if not item:
        continue
    soup = BeautifulSoup(item.get_content(), 'html.parser')
    name = item.get_name()
    h1s = [h.get_text(strip=True) for h in soup.find_all('h1') if h.get_text(strip=True)]
    h2s = [h.get_text(strip=True) for h in soup.find_all('h2') if h.get_text(strip=True)]
    first_p = soup.find('p')
    p_text = first_p.get_text(strip=True)[:70] if first_p else ''
    print(f'[{name}]')
    if h1s: print(f'  H1: {h1s[0][:80]}')
    if h2s: print(f'  H2: {h2s[0][:80]}')
    if not h1s and not h2s: print(f'  P: {p_text}')
