import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Focus*')[0]
book = epub.read_epub(epub_path)

outdir = r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\focus'
os.makedirs(outdir, exist_ok=True)

chapters = [
    ('chapter_01', ['Text/part0003.html']),                                                   # Ch 1: The Subtle Faculty
    ('part1_anatomy_of_attention', ['Text/part0004.html', 'Text/part0005.html',
                                    'Text/part0006.html', 'Text/part0007.html',
                                    'Text/part0008.html']),                                    # Part I: Ch 2-5
    ('part2_self_awareness',       ['Text/part0009.html', 'Text/part0010.html',
                                    'Text/part0011.html', 'Text/part0012.html']),              # Part II: Ch 6-8
    ('part3_reading_others',       ['Text/part0013.html', 'Text/part0014.html',
                                    'Text/part0015.html', 'Text/part0016.html']),              # Part III: Ch 9-11
    ('part4_bigger_context',       ['Text/part0017.html', 'Text/part0018.html',
                                    'Text/part0019.html', 'Text/part0020.html']),              # Part IV: Ch 12-14
    ('part5_smart_practice',       ['Text/part0021.html', 'Text/part0022.html',
                                    'Text/part0023.html', 'Text/part0024.html']),              # Part V: Ch 15-17
    ('part6_well_focused_leader',  ['Text/part0025.html', 'Text/part0026.html',
                                    'Text/part0027.html', 'Text/part0028.html']),              # Part VI: Ch 18-20
    ('part7_big_picture',          ['Text/part0029.html', 'Text/part0030.html']),              # Part VII: Ch 21
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
            if text and text != ' ':
                paragraphs.append(text)
    content = '\n\n'.join(paragraphs)
    outpath = os.path.join(outdir, f'{key}.txt')
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'{key}: {len(content)} chars')
