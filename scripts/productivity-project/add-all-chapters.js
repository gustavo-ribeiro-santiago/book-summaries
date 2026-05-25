const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';
const BOOK_TITLE = 'The Productivity Project: Accomplishing More by Managing Your Time, Attention, and Energy';
const SUMMARIES_DIR = path.join(__dirname, '..', '..', 'summaries', 'productivity-project');

const chaptersMetadata = [
  { number: 0, title: 'INTRODUCTION & A NEW DEFINITION OF PRODUCTIVITY',                        file: 'introduction.md' },
  { number: 1, title: 'PART ONE: LAYING THE GROUNDWORK',                                        file: 'part1_laying_groundwork.md' },
  { number: 2, title: 'PART TWO: WASTING TIME',                                                 file: 'part2_wasting_time.md' },
  { number: 3, title: 'PART THREE: THE END OF TIME MANAGEMENT',                                 file: 'part3_end_of_time_management.md' },
  { number: 4, title: 'PART FOUR: THE ZEN OF PRODUCTIVITY',                                     file: 'part4_zen_of_productivity.md' },
  { number: 5, title: 'PART FIVE: QUIET YOUR MIND',                                             file: 'part5_quiet_your_mind.md' },
  { number: 6, title: 'PART SIX: THE ATTENTION MUSCLE',                                         file: 'part6_attention_muscle.md' },
  { number: 7, title: 'PART SEVEN: TAKING PRODUCTIVITY TO THE NEXT LEVEL',                      file: 'part7_next_level.md' },
  { number: 8, title: 'PART EIGHT: THE FINAL STEP — Being Kind to Yourself & Afterword',        file: 'part8_final_step.md' },
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
    author: 'Chris Bailey',
    userId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: docRef.id, title, author: 'Chris Bailey', userId };
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
