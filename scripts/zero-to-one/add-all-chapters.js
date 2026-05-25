const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';
const BOOK_TITLE = 'Zero to One: Notes on Startups, or How to Build the Future';
const SUMMARIES_DIR = path.join(__dirname, '..', '..', 'summaries', 'zto');

const chaptersMetadata = [
  { number: 0,  title: 'PREFACE: ZERO TO ONE',                       file: 'preface.md' },
  { number: 1,  title: 'THE CHALLENGE OF THE FUTURE',                file: 'chapter_01.md' },
  { number: 2,  title: "PARTY LIKE IT'S 1999",                       file: 'chapter_02.md' },
  { number: 3,  title: 'ALL HAPPY COMPANIES ARE DIFFERENT',          file: 'chapter_03.md' },
  { number: 4,  title: 'THE IDEOLOGY OF COMPETITION',                file: 'chapter_04.md' },
  { number: 5,  title: 'LAST MOVER ADVANTAGE',                       file: 'chapter_05.md' },
  { number: 6,  title: 'YOU ARE NOT A LOTTERY TICKET',               file: 'chapter_06.md' },
  { number: 7,  title: 'FOLLOW THE MONEY',                           file: 'chapter_07.md' },
  { number: 8,  title: 'SECRETS',                                    file: 'chapter_08.md' },
  { number: 9,  title: 'FOUNDATIONS',                                file: 'chapter_09.md' },
  { number: 10, title: 'THE MECHANICS OF MAFIA',                     file: 'chapter_10.md' },
  { number: 11, title: 'IF YOU BUILD IT, WILL THEY COME?',           file: 'chapter_11.md' },
  { number: 12, title: 'MAN AND MACHINE',                            file: 'chapter_12.md' },
  { number: 13, title: 'SEEING GREEN',                               file: 'chapter_13.md' },
  { number: 14, title: "THE FOUNDER'S PARADOX",                      file: 'chapter_14.md' },
  { number: 15, title: 'CONCLUSION: STAGNATION OR SINGULARITY?',     file: 'conclusion.md' },
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
    author: 'Peter Thiel & Blake Masters',
    userId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: docRef.id, title, author: 'Peter Thiel & Blake Masters', userId };
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
