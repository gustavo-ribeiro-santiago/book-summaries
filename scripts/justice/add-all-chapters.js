const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';
const BOOK_TITLE = 'Justice: What\'s the Right Thing to Do?';
const SUMMARIES_DIR = path.join(__dirname, '..', '..', 'summaries', 'justice');

const chaptersMetadata = [
  { number: 1,  title: '1. DOING THE RIGHT THING',                                          file: 'chapter_01.md' },
  { number: 2,  title: '2. THE GREATEST HAPPINESS PRINCIPLE / UTILITARIANISM',              file: 'chapter_02.md' },
  { number: 3,  title: '3. DO WE OWN OURSELVES? / LIBERTARIANISM',                          file: 'chapter_03.md' },
  { number: 4,  title: '4. HIRED HELP / MARKETS AND MORALS',                                file: 'chapter_04.md' },
  { number: 5,  title: '5. WHAT MATTERS IS THE MOTIVE / IMMANUEL KANT',                     file: 'chapter_05.md' },
  { number: 6,  title: '6. THE CASE FOR EQUALITY / JOHN RAWLS',                             file: 'chapter_06.md' },
  { number: 7,  title: '7. ARGUING AFFIRMATIVE ACTION',                                     file: 'chapter_07.md' },
  { number: 8,  title: '8. WHO DESERVES WHAT? / ARISTOTLE',                                 file: 'chapter_08.md' },
  { number: 9,  title: '9. WHAT DO WE OWE ONE ANOTHER? / DILEMMAS OF LOYALTY',              file: 'chapter_09.md' },
  { number: 10, title: '10. JUSTICE AND THE COMMON GOOD',                                   file: 'chapter_10.md' },
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
    author: 'Michael J. Sandel',
    userId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: docRef.id, title, author: 'Michael J. Sandel', userId };
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
