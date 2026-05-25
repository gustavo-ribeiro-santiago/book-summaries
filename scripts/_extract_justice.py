import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Justice*')[0]
book = epub.read_epub(epub_path)

outdir = r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\justice'
os.makedirs(outdir, exist_ok=True)

chapters = [
    ('chapter_01', ['.html_split_004']),   # 1. Doing the Right Thing
    ('chapter_02', ['.html_split_005']),   # 2. The Greatest Happiness Principle / Utilitarianism
    ('chapter_03', ['.html_split_006']),   # 3. Do We Own Ourselves? / Libertarianism
    ('chapter_04', ['.html_split_007']),   # 4. Hired Help / Markets and Morals
    ('chapter_05', ['.html_split_008']),   # 5. What Matters Is the Motive / Immanuel Kant
    ('chapter_06', ['.html_split_009']),   # 6. The Case for Equality / John Rawls
    ('chapter_07', ['.html_split_010']),   # 7. Arguing Affirmative Action
    ('chapter_08', ['.html_split_011']),   # 8. Who Deserves What? / Aristotle
    ('chapter_09', ['.html_split_012']),   # 9. What Do We Owe One Another? / Dilemmas of Loyalty
    ('chapter_10', ['.html_split_013']),   # 10. Justice and the Common Good
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
