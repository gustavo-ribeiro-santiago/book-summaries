const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';
const BOOK_TITLE = 'Chip War: The Fight for the World\'s Most Critical Technology';
const SUMMARIES_DIR = path.join(__dirname, '..', '..', 'summaries', 'chip-war');

const chaptersMetadata = [
  { number: 1,  title: 'Introduction: The World\'s Most Critical Technology',                         file: 'introduction.md' },
  { number: 2,  title: 'Part I: Cold War Chips (Chapters 1–6)',                                        file: 'part1_cold_war_chips.md' },
  { number: 3,  title: 'Part II: The Circuitry of the American World (Chapters 7–14)',                 file: 'part2_american_world.md' },
  { number: 4,  title: 'Part III: Leadership Lost? (Chapters 15–20)',                                  file: 'part3_leadership_lost.md' },
  { number: 5,  title: 'Part IV: America Resurgent (Chapters 21–28)',                                  file: 'part4_america_resurgent.md' },
  { number: 6,  title: 'Part V: Integrated Circuits, Integrated World? (Chapters 29–34)',              file: 'part5_integrated_world.md' },
  { number: 7,  title: 'Part VI: Offshoring Innovation? (Chapters 35–41)',                             file: 'part6_offshoring_innovation.md' },
  { number: 8,  title: 'Part VII: China\'s Challenge (Chapters 42–48)',                                file: 'part7_chinas_challenge.md' },
  { number: 9,  title: 'Part VIII: The Chip Choke (Chapters 49–54)',                                   file: 'part8_chip_choke.md' },
  { number: 10, title: 'Conclusion: The Hidden Circuitry of History',                                  file: 'conclusion.md' },
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
    author: 'Chris Miller',
    userId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: docRef.id, title, author: 'Chris Miller', userId };
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
