import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Principles*')[0]
book = epub.read_epub(epub_path)

outdir = r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\principles'
os.makedirs(outdir, exist_ok=True)

chapters = [
    ('introduction', [
        'text00005.html',                                                   # Introduction
    ]),
    ('part1_early', [
        'text00006.html', 'text00007.html',                                 # Part I header + intro
        'text00008.html', 'text00009.html', 'text00010.html',              # Ch 1-3 (1949–1982)
    ]),
    ('part1_growth', [
        'text00011.html', 'text00012.html', 'text00013.html',              # Ch 4-6 (1983–2015)
    ]),
    ('part1_reflections', [
        'text00014.html', 'text00015.html',                                 # Ch 7-8 (2016–reflections)
        'text00016.html', 'text00017.html',                                 # Bridge/Principles intro
    ]),
    ('lp1_embrace_reality', [
        'text00018.html',                                                   # Part II intro
        'text00019.html', 'text00020.html', 'text00021.html',
        'text00022.html', 'text00023.html', 'text00024.html',              # LP1 all sections
    ]),
    ('lp2_five_step_process', [
        'text00025.html',                                                   # LP2
    ]),
    ('lp3_radical_open_mindedness', [
        'text00026.html', 'text00027.html', 'text00028.html',              # LP3
    ]),
    ('lp4_people_wired_differently', [
        'text00029.html',                                                   # LP4
    ]),
    ('lp5_decisions', [
        'text00030.html', 'text00031.html', 'text00032.html',              # LP5
    ]),
    ('lp_synthesis', [
        'text00033.html', 'text00034.html',                                 # LP putting it together + summary
    ]),
    ('wp_culture', [
        'text00035.html', 'text00036.html', 'text00037.html',
        'text00038.html', 'text00039.html', 'text00040.html',
        'text00041.html', 'text00042.html',                                 # Part III intro + culture intro
        'text00043.html', 'text00044.html',                                 # WP1 Radical Truth & Transparency
        'text00045.html',                                                   # WP2 Meaningful Work & Relationships
        'text00046.html',                                                   # WP3 Okay to Make Mistakes
        'text00047.html',                                                   # WP4 Get and Stay in Sync
        'text00048.html',                                                   # WP5 Believability-Weight Decisions
        'text00049.html', 'text00050.html',                                 # WP6 Get Beyond Disagreements
    ]),
    ('wp_people', [
        'text00051.html', 'text00052.html', 'text00053.html',              # People section intro
        'text00054.html',                                                   # WP7 WHO over WHAT
        'text00055.html',                                                   # WP8 Hire Right
        'text00056.html',                                                   # WP9 Train, Test, Evaluate, Sort
    ]),
    ('wp_machine', [
        'text00057.html', 'text00058.html', 'text00059.html', 'text00060.html',  # Machine section intro
        'text00061.html',                                                   # WP10 Manage as Machine Operator
        'text00062.html',                                                   # WP11 Perceive and Don't Tolerate Problems
        'text00063.html',                                                   # WP12 Diagnose Root Causes
        'text00064.html', 'text00065.html',                                 # WP13 Design Improvements
        'text00066.html',                                                   # WP14 Do What You Set Out to Do
        'text00067.html',                                                   # WP15 Use Tools and Protocols
        'text00068.html',                                                   # WP16 Governance
        'text00069.html',                                                   # WP Putting It All Together
    ]),
    ('conclusion', [
        'text00072.html',                                                   # Conclusion
    ]),
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
