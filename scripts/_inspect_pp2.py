import sys, glob, ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\The productivity project*')[0]
book = epub.read_epub(epub_path)

files = [
    'xhtml/Bail_9781101904046_epub3_p01_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c01_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c02_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c03_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c04_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_p02_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c05_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c06_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c07_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_p03_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c08_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c09_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c10_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c11_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_p04_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c12_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c13_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c14_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_p05_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c15_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c16_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c17_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_p06_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c18_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c19_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c20_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c21_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_p07_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c22_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c23_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c24_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c25_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_p08_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c26_r1.xhtml',
]

for href in files:
    item = book.get_item_with_href(href)
    soup = BeautifulSoup(item.get_content(), 'html.parser')
    name = href.split('/')[-1]
    h1s = [h.get_text(strip=True) for h in soup.find_all('h1') if h.get_text(strip=True)]
    print(f'[{name}]: {" | ".join(h1s[:3])}')
