const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';
const BOOK_TITLE = 'Principles: Life and Work';
const SUMMARIES_DIR = path.join(__dirname, '..', '..', 'summaries', 'principles');

const chaptersMetadata = [
  { number: 0,  title: 'INTRODUCTION',                                               file: 'introduction.md' },
  { number: 1,  title: 'PART I: WHERE I\'M COMING FROM — Chapters 1–3 (1949–1982)', file: 'part1_early.md' },
  { number: 2,  title: 'PART I: WHERE I\'M COMING FROM — Chapters 4–6 (1983–2015)', file: 'part1_growth.md' },
  { number: 3,  title: 'PART I: WHERE I\'M COMING FROM — Chapters 7–8 & Reflections', file: 'part1_reflections.md' },
  { number: 4,  title: 'LIFE PRINCIPLE 1: Embrace Reality and Deal with It',         file: 'lp1_embrace_reality.md' },
  { number: 5,  title: 'LIFE PRINCIPLE 2: Use the 5-Step Process',                   file: 'lp2_five_step_process.md' },
  { number: 6,  title: 'LIFE PRINCIPLE 3: Be Radically Open-Minded',                 file: 'lp3_radical_open_mindedness.md' },
  { number: 7,  title: 'LIFE PRINCIPLE 4: Understand That People Are Wired Differently', file: 'lp4_people_wired_differently.md' },
  { number: 8,  title: 'LIFE PRINCIPLE 5: Learn How to Make Decisions Effectively',  file: 'lp5_decisions.md' },
  { number: 9,  title: 'LIFE PRINCIPLES: Putting It All Together',                   file: 'lp_synthesis.md' },
  { number: 10, title: 'WORK PRINCIPLES: Culture — Radical Truth, Transparency & Idea Meritocracy (WP1–6)', file: 'wp_culture.md' },
  { number: 11, title: 'WORK PRINCIPLES: Getting the People Right (WP7–9)',          file: 'wp_people.md' },
  { number: 12, title: 'WORK PRINCIPLES: Building and Evolving Your Machine (WP10–16)', file: 'wp_machine.md' },
  { number: 13, title: 'CONCLUSION',                                                  file: 'conclusion.md' },
];

function readChapterSummary(filename) {
  const filePath = path.join(SUMMARIES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`   Warning: Summary file not found: ${filename}`);
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

async function findBookByTitle(userId, title) {
  const booksRef = db.collection('books');
  const snapshot = await booksRef
    .where('userId', '==', userId)
    .where('title', '==', title)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function createBook(userId, title) {
  const booksRef = db.collection('books');
  const docRef = await booksRef.add({
    title: title,
    author: 'Ray Dalio',
    userId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: docRef.id, title, author: 'Ray Dalio', userId };
}

async function addOrUpdateChapter(bookId, chapterData) {
  const chaptersRef = db.collection('books').doc(bookId).collection('chapters');
  const snapshot = await chaptersRef
    .where('number', '==', chapterData.number)
    .get();

  if (snapshot.empty) {
    await chaptersRef.add({
      ...chapterData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`   ✓ Added chapter ${chapterData.number}: ${chapterData.title}`);
  } else {
    const docRef = snapshot.docs[0].ref;
    await docRef.update({
      ...chapterData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`   ↻ Updated chapter ${chapterData.number}: ${chapterData.title}`);
  }
}

async function main() {
  console.log(`\n📚 Processing: "${BOOK_TITLE}"`);
  console.log('─'.repeat(60));

  let book = await findBookByTitle(USER_ID, BOOK_TITLE);

  if (book) {
    console.log(`✓ Found existing book: ${book.id}`);
  } else {
    book = await createBook(USER_ID, BOOK_TITLE);
    console.log(`✓ Created new book: ${book.id}`);
  }

  console.log(`\nUploading ${chaptersMetadata.length} chapters...\n`);

  for (const meta of chaptersMetadata) {
    const summary = readChapterSummary(meta.file);
    if (!summary) continue;

    await addOrUpdateChapter(book.id, {
      number: meta.number,
      title: meta.title,
      summary: summary,
    });
  }

  console.log('\n✅ All chapters uploaded successfully.');
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
