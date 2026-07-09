const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';
const BOOK_TITLE = 'Sapiens: A Brief History of Humankind';
const BOOK_AUTHOR = 'Yuval Noah Harari';
const SUMMARIES_DIR = path.join(__dirname, '..', '..', 'summaries', 'sapiens');

const chaptersMetadata = [
  { chapterNumber: 1,  title: 'Chapter 1: An Animal of No Significance',          file: 'chapter_01.md' },
  { chapterNumber: 2,  title: 'Chapter 2: The Tree of Knowledge',                 file: 'chapter_02.md' },
  { chapterNumber: 3,  title: 'Chapter 3: A Day in the Life of Adam and Eve',     file: 'chapter_03.md' },
  { chapterNumber: 4,  title: 'Chapter 4: The Flood',                             file: 'chapter_04.md' },
  { chapterNumber: 5,  title: "Chapter 5: History's Biggest Fraud",               file: 'chapter_05.md' },
  { chapterNumber: 6,  title: 'Chapter 6: Building Pyramids',                     file: 'chapter_06.md' },
  { chapterNumber: 7,  title: 'Chapter 7: Memory Overload',                       file: 'chapter_07.md' },
  { chapterNumber: 8,  title: 'Chapter 8: There Is No Justice in History',       file: 'chapter_08.md' },
  { chapterNumber: 9,  title: 'Chapter 9: The Arrow of History',                  file: 'chapter_09.md' },
  { chapterNumber: 10, title: 'Chapter 10: The Scent of Money',                   file: 'chapter_10.md' },
  { chapterNumber: 11, title: 'Chapter 11: Imperial Visions',                     file: 'chapter_11.md' },
  { chapterNumber: 12, title: 'Chapter 12: The Law of Religion',                  file: 'chapter_12.md' },
  { chapterNumber: 13, title: 'Chapter 13: The Secret of Success',                file: 'chapter_13.md' },
  { chapterNumber: 14, title: 'Chapter 14: The Discovery of Ignorance',           file: 'chapter_14.md' },
  { chapterNumber: 15, title: 'Chapter 15: The Marriage of Science and Empire',   file: 'chapter_15.md' },
  { chapterNumber: 16, title: 'Chapter 16: The Capitalist Creed',                 file: 'chapter_16.md' },
  { chapterNumber: 17, title: 'Chapter 17: The Wheels of Industry',               file: 'chapter_17.md' },
  { chapterNumber: 18, title: 'Chapter 18: A Permanent Revolution',               file: 'chapter_18.md' },
  { chapterNumber: 19, title: 'Chapter 19: And They Lived Happily Ever After',    file: 'chapter_19.md' },
  { chapterNumber: 20, title: 'Chapter 20: The End of Homo Sapiens',              file: 'chapter_20.md' },
  { chapterNumber: 21, title: 'Afterword: The Animal that Became a God',          file: 'afterword.md' },
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
    author: BOOK_AUTHOR,
    userId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: docRef.id, title, author: BOOK_AUTHOR, userId };
}

async function addOrUpdateChapter(bookId, userId, chapterData) {
  const chaptersRef = db.collection('books').doc(bookId).collection('chapters');
  const snapshot = await chaptersRef
    .where('chapterNumber', '==', chapterData.chapterNumber)
    .get();

  const fullData = {
    ...chapterData,
    bookId,
    userId,
  };

  if (snapshot.empty) {
    await chaptersRef.add({
      ...fullData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`   + Added chapter ${chapterData.chapterNumber}: ${chapterData.title}`);
  } else {
    const docRef = snapshot.docs[0].ref;
    await docRef.update({
      ...fullData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`   ~ Updated chapter ${chapterData.chapterNumber}: ${chapterData.title}`);
  }
}

async function main() {
  console.log(`\nProcessing: "${BOOK_TITLE}"`);
  console.log('-'.repeat(60));

  let book = await findBookByTitle(USER_ID, BOOK_TITLE);

  if (book) {
    console.log(`Found existing book: ${book.id}`);
  } else {
    book = await createBook(USER_ID, BOOK_TITLE);
    console.log(`Created new book: ${book.id}`);
  }

  console.log(`\nUploading ${chaptersMetadata.length} chapters...\n`);

  for (const meta of chaptersMetadata) {
    const summary = readChapterSummary(meta.file);
    if (!summary) continue;

    await addOrUpdateChapter(book.id, USER_ID, {
      chapterNumber: meta.chapterNumber,
      title: meta.title,
      summary: summary,
    });
  }

  console.log('\nAll chapters uploaded successfully.');
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
