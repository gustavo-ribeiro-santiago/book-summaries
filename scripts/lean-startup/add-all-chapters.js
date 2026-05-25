/**
 * Script to add all chapters of "The Lean Startup" to Firestore
 * Reads chapter summaries from the summaries/ls folder
 *
 * Prerequisites:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Download service account key from Firebase Console
 * 3. Save as "serviceAccountKey.json" in the scripts folder
 * 4. Run: node scripts/lean-startup/add-all-chapters.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';
const BOOK_TITLE = 'The Lean Startup';
const SUMMARIES_DIR = path.join(__dirname, '..', '..', 'summaries', 'ls');

const chaptersMetadata = [
  { number: 0,  title: 'INTRODUCTION',          file: 'introduction.md' },
  { number: 1,  title: 'START',                  file: 'chapter_01.md' },
  { number: 2,  title: 'DEFINE',                 file: 'chapter_02.md' },
  { number: 3,  title: 'LEARN',                  file: 'chapter_03.md' },
  { number: 4,  title: 'EXPERIMENT',             file: 'chapter_04.md' },
  { number: 5,  title: 'LEAP',                   file: 'chapter_05.md' },
  { number: 6,  title: 'TEST',                   file: 'chapter_06.md' },
  { number: 7,  title: 'MEASURE',                file: 'chapter_07.md' },
  { number: 8,  title: 'PIVOT (OR PERSEVERE)',   file: 'chapter_08.md' },
  { number: 9,  title: 'BATCH',                  file: 'chapter_09.md' },
  { number: 10, title: 'GROW',                   file: 'chapter_10.md' },
  { number: 11, title: 'ADAPT',                  file: 'chapter_11.md' },
  { number: 12, title: 'INNOVATE',               file: 'chapter_12.md' },
  { number: 13, title: 'EPILOGUE: WASTE NOT',    file: 'epilogue.md' },
  { number: 14, title: 'JOIN THE MOVEMENT',      file: 'join_movement.md' },
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

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function createBook(userId, title) {
  const booksRef = db.collection('books');
  const docRef = await booksRef.add({
    title: title,
    author: 'Eric Ries',
    userId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: docRef.id, title, author: 'Eric Ries', userId };
}

async function addOrUpdateChapter(bookId, chapterData) {
  const chaptersRef = db.collection('books').doc(bookId).collection('chapters');

  const existingChapter = await chaptersRef
    .where('chapterNumber', '==', chapterData.chapterNumber)
    .get();

  if (!existingChapter.empty) {
    const docId = existingChapter.docs[0].id;
    await chaptersRef.doc(docId).update({
      ...chapterData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { id: docId, updated: true };
  }

  const docRef = await chaptersRef.add({
    ...chapterData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { id: docRef.id, updated: false };
}

async function main() {
  try {
    console.log('📚 The Lean Startup - Eric Ries');
    console.log('   Uploading all chapters to Firestore\n');
    console.log('🔍 Finding book for user:', USER_ID);

    let book = await findBookByTitle(USER_ID, BOOK_TITLE);

    if (!book) {
      console.log('📖 Book not found. Creating it...');
      book = await createBook(USER_ID, BOOK_TITLE);
      console.log('✅ Book created with ID:', book.id);
    } else {
      console.log('✅ Book found with ID:', book.id);
    }

    console.log('\n📝 Processing chapters...\n');

    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const meta of chaptersMetadata) {
      const summary = readChapterSummary(meta.file);

      if (!summary) {
        console.log(`   [${meta.number}] ⏭️  Skipped (no summary file)`);
        skipped++;
        continue;
      }

      const chapterData = {
        bookId: book.id,
        title: meta.title,
        chapterNumber: meta.number,
        summary: summary,
        userId: USER_ID
      };

      const result = await addOrUpdateChapter(book.id, chapterData);

      if (result.updated) {
        console.log(`   [${meta.number}] 🔄 Updated: ${meta.title.substring(0, 55)}`);
        updated++;
      } else {
        console.log(`   [${meta.number}] ✅ Added: ${meta.title.substring(0, 55)}`);
        added++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✅ Added: ${added} chapters`);
    console.log(`   🔄 Updated: ${updated} chapters`);
    console.log(`   ⏭️  Skipped: ${skipped} chapters`);
    console.log('='.repeat(60));
    console.log('\n🎉 Done!');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
