import sys, glob, ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\The productivity project*')[0]
book = epub.read_epub(epub_path)

files = [
    'xhtml/Bail_9781101904046_epub3_itr_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_fm1_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_p01_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c01_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c05_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c08_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c12_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c15_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c18_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c22_r1.xhtml',
    'xhtml/Bail_9781101904046_epub3_c26_r1.xhtml',
]

for href in files:
    item = book.get_item_with_href(href)
    soup = BeautifulSoup(item.get_content(), 'html.parser')
    name = href.split('/')[-1]
    print(f'=== {name} ===')
    for tag in soup.find_all(['h1','h2','h3','h4','p','div'])[:12]:
        t = tag.get_text(strip=True)
        if t:
            print(f'  <{tag.name}>: {t[:100]}')
    print()
