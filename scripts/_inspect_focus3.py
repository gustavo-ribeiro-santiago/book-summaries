import sys, glob, ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Focus*')[0]
book = epub.read_epub(epub_path)

# Print full TOC from part0002 (table of contents)
item = book.get_item_with_href('Text/part0002.html')
soup = BeautifulSoup(item.get_content(), 'html.parser')
print('=== FULL TABLE OF CONTENTS ===')
print(soup.get_text(separator='\n', strip=True))

print('\n\n=== ALL PART FILES WITH CHAPTER TITLES ===')
for i in range(3, 41):
    fname = f'Text/part{i:04d}.html'
    item = book.get_item_with_href(fname)
    if not item:
        continue
    soup = BeautifulSoup(item.get_content(), 'html.parser')
    # Try to find chapter/part title using calibre CSS classes
    chap_num = soup.find(class_='x1chap-num')
    chap_ttl = soup.find(class_='x1chap-ttl')
    part_num = soup.find(class_='x1part-num')
    part_ttl = soup.find(class_='x1part-ttl')
    first_p = soup.find('p')
    
    num_txt = chap_num.get_text(strip=True) if chap_num else ''
    ttl_txt = chap_ttl.get_text(strip=True) if chap_ttl else ''
    pnum_txt = part_num.get_text(strip=True) if part_num else ''
    pttl_txt = part_ttl.get_text(strip=True) if part_ttl else ''
    fp_txt = first_p.get_text(strip=True)[:60] if first_p else ''
    
    if ttl_txt:
        print(f'[{fname}] Ch {num_txt}: {ttl_txt}')
    elif pttl_txt:
        print(f'[{fname}] PART {pnum_txt}: {pttl_txt}')
    else:
        # look for any bold/title-like class
        all_text = soup.get_text(separator=' ', strip=True)[:80]
        print(f'[{fname}] {all_text}')
