import glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

epub_path = glob.glob(r'c:\Users\gusta\Documents\My GitHub\book-summaries\scripts\Thinking*')[0]
book = epub.read_epub(epub_path)

outdir = r'c:\Users\gusta\Documents\My GitHub\book-summaries\scripts\thinking-fast-and-slow'
os.makedirs(outdir, exist_ok=True)

# Maps (output_key, [list of split file hrefs to merge])
# Part headers are merged with their intro split to give full context
chapters = [
    ('introduction',    ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_003.html']),
    ('part_1_intro',    ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_004.html',
                         'CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_005.html']),
    ('chapter_01',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_006.html']),
    ('chapter_02',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_007.html']),
    ('chapter_03',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_008.html']),
    ('chapter_04',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_009.html']),
    ('chapter_05',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_010.html']),
    ('chapter_06',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_011.html']),
    ('chapter_07',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_012.html']),
    ('chapter_08',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_013.html']),
    ('chapter_09',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_014.html']),
    ('part_2_intro',    ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_015.html',
                         'CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_016.html']),
    ('chapter_10',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_017.html']),
    ('chapter_11',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_018.html']),
    ('chapter_12',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_019.html']),
    ('chapter_13',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_020.html']),
    ('chapter_14',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_021.html']),
    ('chapter_15',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_022.html']),
    ('chapter_16',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_023.html']),
    ('chapter_17',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_024.html']),
    ('chapter_18',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_025.html']),
    ('part_3_intro',    ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_026.html',
                         'CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_027.html']),
    ('chapter_19',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_028.html']),
    ('chapter_20',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_029.html']),
    ('chapter_21',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_030.html']),
    ('chapter_22',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_031.html']),
    ('chapter_23',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_032.html']),
    ('chapter_24',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_033.html']),
    ('part_4_intro',    ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_034.html',
                         'CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_035.html']),
    ('chapter_25',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_036.html']),
    ('chapter_26',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_037.html']),
    ('chapter_27',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_038.html']),
    ('chapter_28',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_039.html']),
    ('chapter_29',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_040.html']),
    ('chapter_30',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_041.html']),
    ('chapter_31',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_042.html']),
    ('chapter_32',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_043.html']),
    ('chapter_33',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_044.html']),
    ('chapter_34',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_045.html']),
    ('part_5_intro',    ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_046.html',
                         'CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_047.html']),
    ('chapter_35',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_048.html']),
    ('chapter_36',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_049.html']),
    ('chapter_37',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_050.html']),
    ('chapter_38',      ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_051.html']),
    ('conclusions',     ['CR!TA0Q4JDFX96QN90P9V64BBTEV4QG_split_052.html']),
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
