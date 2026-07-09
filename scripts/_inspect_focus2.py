import sys, glob, ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Focus*')[0]
book = epub.read_epub(epub_path)

# Look at first few files in detail
files = ['Text/part0001.html', 'Text/part0002.html', 'Text/part0003.html', 'Text/part0004.html', 'Text/part0005.html']

for fname in files:
    item = book.get_item_with_href(fname)
    if not item:
        print(f'NOT FOUND: {fname}')
        continue
    content = item.get_content().decode('utf-8', errors='replace')
    print(f'\n=== {fname} (first 800 chars of raw HTML) ===')
    print(content[:800])
    print('---')
    soup = BeautifulSoup(content, 'html.parser')
    # Print all text
    text = soup.get_text(separator='\n', strip=True)
    print(f'TEXT CONTENT (first 300 chars): {text[:300]}')
