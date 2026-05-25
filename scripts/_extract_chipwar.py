import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Chris Miller*')[0]
book = epub.read_epub(epub_path)

outdir = r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\chip-war'
os.makedirs(outdir, exist_ok=True)

base = 'e9781982172022/xhtml/'

chapters = [
    ('introduction', [base + 'intro.xhtml']),
    ('part1_cold_war_chips', [
        base + 'ch01.xhtml', base + 'ch02.xhtml', base + 'ch03.xhtml',
        base + 'ch04.xhtml', base + 'ch05.xhtml', base + 'ch06.xhtml',
    ]),
    ('part2_american_world', [
        base + 'ch07.xhtml', base + 'ch08.xhtml', base + 'ch09.xhtml',
        base + 'ch10.xhtml', base + 'ch11.xhtml', base + 'ch12.xhtml',
        base + 'ch13.xhtml', base + 'ch14.xhtml',
    ]),
    ('part3_leadership_lost', [
        base + 'ch15.xhtml', base + 'ch16.xhtml', base + 'ch17.xhtml',
        base + 'ch18.xhtml', base + 'ch19.xhtml', base + 'ch20.xhtml',
    ]),
    ('part4_america_resurgent', [
        base + 'ch21.xhtml', base + 'ch22.xhtml', base + 'ch23.xhtml',
        base + 'ch24.xhtml', base + 'ch25.xhtml', base + 'ch26.xhtml',
        base + 'ch27.xhtml', base + 'ch28.xhtml',
    ]),
    ('part5_integrated_world', [
        base + 'ch29.xhtml', base + 'ch30.xhtml', base + 'ch31.xhtml',
        base + 'ch32.xhtml', base + 'ch33.xhtml', base + 'ch34.xhtml',
    ]),
    ('part6_offshoring_innovation', [
        base + 'ch35.xhtml', base + 'ch36.xhtml', base + 'ch37.xhtml',
        base + 'ch38.xhtml', base + 'ch39.xhtml', base + 'ch40.xhtml',
        base + 'ch41.xhtml',
    ]),
    ('part7_chinas_challenge', [
        base + 'ch42.xhtml', base + 'ch43.xhtml', base + 'ch44.xhtml',
        base + 'ch45.xhtml', base + 'ch46.xhtml', base + 'ch47.xhtml',
        base + 'ch48.xhtml',
    ]),
    ('part8_chip_choke', [
        base + 'ch49.xhtml', base + 'ch50.xhtml', base + 'ch51.xhtml',
        base + 'ch52.xhtml', base + 'ch53.xhtml', base + 'ch54.xhtml',
    ]),
    ('conclusion', [base + 'bm01.xhtml']),
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
