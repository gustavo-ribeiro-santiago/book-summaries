import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\AI Engineering*')[0]
book = epub.read_epub(epub_path)

outdir = r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\ai-engineering'
os.makedirs(outdir, exist_ok=True)

chapters = [
    ('chapter_01', ['ch01.html']),   # Introduction to Building AI Applications
    ('chapter_02', ['ch02.html']),   # Understanding Foundation Models
    ('chapter_03', ['ch03.html']),   # Evaluation Methodology
    ('chapter_04', ['ch04.html']),   # Evaluate AI Systems
    ('chapter_05', ['ch05.html']),   # Prompt Engineering
    ('chapter_06', ['ch06.html']),   # RAG and Agents
    ('chapter_07', ['ch07.html']),   # Finetuning
    ('chapter_08', ['ch08.html']),   # Dataset Engineering
    ('chapter_09', ['ch09.html']),   # Inference Optimization
    ('chapter_10', ['ch10.html']),   # AI Engineering Architecture and User Feedback
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
