/**
 * Script to add all chapters of "Thinking, Fast and Slow" to Firestore
 * Reads chapter summaries from the summaries/tfs folder
 *
 * Prerequisites:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Download service account key from Firebase Console
 * 3. Save as "serviceAccountKey.json" in the scripts folder
 * 4. Run: node scripts/thinking-fast-and-slow/add-all-chapters.js
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
const BOOK_TITLE = 'Thinking, Fast and Slow';
const SUMMARIES_DIR = path.join(__dirname, '..', '..', 'summaries', 'tfs');

const chaptersMetadata = [
  { number: 0,  title: 'INTRODUCTION',                           file: 'introduction.md' },
  { number: 1,  title: 'THE CHARACTERS OF THE STORY',            file: 'chapter_01.md' },
  { number: 2,  title: 'ATTENTION AND EFFORT',                   file: 'chapter_02.md' },
  { number: 3,  title: 'THE LAZY CONTROLLER',                    file: 'chapter_03.md' },
  { number: 4,  title: 'THE ASSOCIATIVE MACHINE',                file: 'chapter_04.md' },
  { number: 5,  title: 'COGNITIVE EASE',                         file: 'chapter_05.md' },
  { number: 6,  title: 'NORMS, SURPRISES, AND CAUSES',           file: 'chapter_06.md' },
  { number: 7,  title: 'A MACHINE FOR JUMPING TO CONCLUSIONS',   file: 'chapter_07.md' },
  { number: 8,  title: 'HOW JUDGMENTS HAPPEN',                   file: 'chapter_08.md' },
  { number: 9,  title: 'ANSWERING AN EASIER QUESTION',           file: 'chapter_09.md' },
  { number: 10, title: 'THE LAW OF SMALL NUMBERS',               file: 'chapter_10.md' },
  { number: 11, title: 'ANCHORS',                                file: 'chapter_11.md' },
  { number: 12, title: 'THE SCIENCE OF AVAILABILITY',            file: 'chapter_12.md' },
  { number: 13, title: 'AVAILABILITY, EMOTION, AND RISK',        file: 'chapter_13.md' },
  { number: 14, title: "TOM W'S SPECIALTY",                      file: 'chapter_14.md' },
  { number: 15, title: 'LINDA: LESS IS MORE',                    file: 'chapter_15.md' },
  { number: 16, title: 'CAUSES TRUMP STATISTICS',                file: 'chapter_16.md' },
  { number: 17, title: 'REGRESSION TO THE MEAN',                 file: 'chapter_17.md' },
  { number: 18, title: 'TAMING INTUITIVE PREDICTIONS',           file: 'chapter_18.md' },
  { number: 19, title: 'THE ILLUSION OF UNDERSTANDING',          file: 'chapter_19.md' },
  { number: 20, title: 'THE ILLUSION OF VALIDITY',               file: 'chapter_20.md' },
  { number: 21, title: 'INTUITIONS VS. FORMULAS',                file: 'chapter_21.md' },
  { number: 22, title: 'EXPERT INTUITION: WHEN CAN WE TRUST IT?', file: 'chapter_22.md' },
  { number: 23, title: 'THE OUTSIDE VIEW',                       file: 'chapter_23.md' },
  { number: 24, title: 'THE ENGINE OF CAPITALISM',               file: 'chapter_24.md' },
  { number: 25, title: "BERNOULLI'S ERRORS",                     file: 'chapter_25.md' },
  { number: 26, title: 'PROSPECT THEORY',                        file: 'chapter_26.md' },
  { number: 27, title: 'THE ENDOWMENT EFFECT',                   file: 'chapter_27.md' },
  { number: 28, title: 'BAD EVENTS',                             file: 'chapter_28.md' },
  { number: 29, title: 'THE FOURFOLD PATTERN',                   file: 'chapter_29.md' },
  { number: 30, title: 'RARE EVENTS',                            file: 'chapter_30.md' },
  { number: 31, title: 'RISK POLICIES',                          file: 'chapter_31.md' },
  { number: 32, title: 'KEEPING SCORE',                          file: 'chapter_32.md' },
  { number: 33, title: 'REVERSALS',                              file: 'chapter_33.md' },
  { number: 34, title: 'FRAMES AND REALITY',                     file: 'chapter_34.md' },
  { number: 35, title: 'TWO SELVES',                             file: 'chapter_35.md' },
  { number: 36, title: 'LIFE AS A STORY',                        file: 'chapter_36.md' },
  { number: 37, title: 'EXPERIENCED WELL-BEING',                 file: 'chapter_37.md' },
  { number: 38, title: 'THINKING ABOUT LIFE',                    file: 'chapter_38.md' },
  { number: 39, title: 'CONCLUSIONS',                            file: 'conclusions.md' },
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
    author: 'Daniel Kahneman',
    userId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: docRef.id, title, author: 'Daniel Kahneman', userId };
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
    console.log('📚 Thinking, Fast and Slow - Daniel Kahneman');
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
