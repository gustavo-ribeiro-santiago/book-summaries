import sys, glob, ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Sapiens*')[0]
book = epub.read_epub(epub_path)

item = book.get_item_with_href('OEBPS/Hara_9780771038525_epub_toc_r1.htm')
soup = BeautifulSoup(item.get_content(), 'html.parser')
print('=== TOC ===')
print(soup.get_text(separator='\n', strip=True))
