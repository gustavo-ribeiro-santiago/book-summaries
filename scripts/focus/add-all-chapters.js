const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';
const BOOK_TITLE = 'Focus: The Hidden Driver of Excellence';
const SUMMARIES_DIR = path.join(__dirname, '..', '..', 'summaries', 'focus');

const chaptersMetadata = [
  { chapterNumber: 1,  title: 'Chapter 1: The Subtle Faculty',                                              file: 'chapter_01.md' },
  { chapterNumber: 2,  title: 'Part I: The Anatomy of Attention (Chapters 2–5)',                             file: 'part1_anatomy_of_attention.md' },
  { chapterNumber: 3,  title: 'Part II: Self-Awareness (Chapters 6–8)',                                      file: 'part2_self_awareness.md' },
  { chapterNumber: 4,  title: 'Part III: Reading Others (Chapters 9–11)',                                    file: 'part3_reading_others.md' },
  { chapterNumber: 5,  title: 'Part IV: The Bigger Context (Chapters 12–14)',                                file: 'part4_bigger_context.md' },
  { chapterNumber: 6,  title: 'Part V: Smart Practice (Chapters 15–17)',                                     file: 'part5_smart_practice.md' },
  { chapterNumber: 7,  title: 'Part VI: The Well-Focused Leader (Chapters 18–20)',                           file: 'part6_well_focused_leader.md' },
  { chapterNumber: 8,  title: 'Part VII: The Big Picture (Chapter 21)',                                      file: 'part7_big_picture.md' },
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
    author: 'Daniel Goleman',
    userId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: docRef.id, title, author: 'Daniel Goleman', userId };
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
    console.log(`   ✓ Added chapter ${chapterData.chapterNumber}: ${chapterData.title}`);
  } else {
    const docRef = snapshot.docs[0].ref;
    await docRef.update({
      ...fullData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`   ↻ Updated chapter ${chapterData.chapterNumber}: ${chapterData.title}`);
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

    await addOrUpdateChapter(book.id, USER_ID, {
      chapterNumber: meta.chapterNumber,
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
