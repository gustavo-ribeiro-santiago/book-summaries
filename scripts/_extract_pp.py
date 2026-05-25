import sys, glob, ebooklib, os
from ebooklib import epub
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

epub_path = glob.glob(r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\The productivity project*')[0]
book = epub.read_epub(epub_path)

outdir = r'C:\Users\gusta\Documents\My GitHub\book-summaries\scripts\productivity-project'
os.makedirs(outdir, exist_ok=True)

chapters = [
    ('introduction', [
        'xhtml/Bail_9781101904046_epub3_itr_r1.xhtml',   # Introduction
        'xhtml/Bail_9781101904046_epub3_fm1_r1.xhtml',   # A New Definition of Productivity
    ]),
    ('part1_laying_groundwork', [
        'xhtml/Bail_9781101904046_epub3_p01_r1.xhtml',   # Part One: Laying the Groundwork
        'xhtml/Bail_9781101904046_epub3_c01_r1.xhtml',   # Where to Start
        'xhtml/Bail_9781101904046_epub3_c02_r1.xhtml',   # Not All Tasks Are Created Equal
        'xhtml/Bail_9781101904046_epub3_c03_r1.xhtml',   # Three Daily Tasks
        'xhtml/Bail_9781101904046_epub3_c04_r1.xhtml',   # Ready for Prime Time
    ]),
    ('part2_wasting_time', [
        'xhtml/Bail_9781101904046_epub3_p02_r1.xhtml',   # Part Two: Wasting Time
        'xhtml/Bail_9781101904046_epub3_c05_r1.xhtml',   # Cozying Up to Ugly Tasks
        'xhtml/Bail_9781101904046_epub3_c06_r1.xhtml',   # Meet Yourself... From the Future
        'xhtml/Bail_9781101904046_epub3_c07_r1.xhtml',   # Why the Internet Is Killing Your Productivity
    ]),
    ('part3_end_of_time_management', [
        'xhtml/Bail_9781101904046_epub3_p03_r1.xhtml',   # Part Three: The End of Time Management
        'xhtml/Bail_9781101904046_epub3_c08_r1.xhtml',   # The Time Economy
        'xhtml/Bail_9781101904046_epub3_c09_r1.xhtml',   # Working Less
        'xhtml/Bail_9781101904046_epub3_c10_r1.xhtml',   # Energy Enlightenment
        'xhtml/Bail_9781101904046_epub3_c11_r1.xhtml',   # Cleaning House
    ]),
    ('part4_zen_of_productivity', [
        'xhtml/Bail_9781101904046_epub3_p04_r1.xhtml',   # Part Four: The Zen of Productivity
        'xhtml/Bail_9781101904046_epub3_c12_r1.xhtml',   # The Zen of Productivity
        'xhtml/Bail_9781101904046_epub3_c13_r1.xhtml',   # Shrinking the Unimportant
        'xhtml/Bail_9781101904046_epub3_c14_r1.xhtml',   # Removing the Unimportant
    ]),
    ('part5_quiet_your_mind', [
        'xhtml/Bail_9781101904046_epub3_p05_r1.xhtml',   # Part Five: Quiet Your Mind
        'xhtml/Bail_9781101904046_epub3_c15_r1.xhtml',   # Emptying Your Brain
        'xhtml/Bail_9781101904046_epub3_c16_r1.xhtml',   # Rising Up
        'xhtml/Bail_9781101904046_epub3_c17_r1.xhtml',   # Making Room
    ]),
    ('part6_attention_muscle', [
        'xhtml/Bail_9781101904046_epub3_p06_r1.xhtml',   # Part Six: The Attention Muscle
        'xhtml/Bail_9781101904046_epub3_c18_r1.xhtml',   # Becoming More Deliberate
        'xhtml/Bail_9781101904046_epub3_c19_r1.xhtml',   # Attention Hijackers
        'xhtml/Bail_9781101904046_epub3_c20_r1.xhtml',   # The Art of Doing One Thing
        'xhtml/Bail_9781101904046_epub3_c21_r1.xhtml',   # The Meditation Chapter
    ]),
    ('part7_next_level', [
        'xhtml/Bail_9781101904046_epub3_p07_r1.xhtml',   # Part Seven: Taking Productivity to the Next Level
        'xhtml/Bail_9781101904046_epub3_c22_r1.xhtml',   # Refueling
        'xhtml/Bail_9781101904046_epub3_c23_r1.xhtml',   # Drinking for Energy
        'xhtml/Bail_9781101904046_epub3_c24_r1.xhtml',   # The Exercise Pill
        'xhtml/Bail_9781101904046_epub3_c25_r1.xhtml',   # Sleeping Your Way to Productivity
    ]),
    ('part8_final_step', [
        'xhtml/Bail_9781101904046_epub3_p08_r1.xhtml',   # Part Eight: The Final Step
        'xhtml/Bail_9781101904046_epub3_c26_r1.xhtml',   # The Final Step
        'xhtml/Bail_9781101904046_epub3_aft_r1.xhtml',   # Afterword: One Year Later
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
