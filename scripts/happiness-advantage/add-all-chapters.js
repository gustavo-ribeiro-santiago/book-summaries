const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';
const BOOK_TITLE = 'The Happiness Advantage';
const SUMMARIES_DIR = path.join(__dirname, '..', '..', 'summaries', 'tha');

const chaptersMetadata = [
  { number: 0, title: 'INTRODUCTION', file: 'introduction.md' },
  { number: 1, title: 'THE HAPPINESS ADVANTAGE: HOW HAPPINESS GIVES YOUR BRAIN THE COMPETITIVE EDGE', file: 'principle_1.md' },
  { number: 2, title: 'THE FULCRUM AND THE LEVER: CHANGING YOUR PERFORMANCE BY CHANGING YOUR MINDSET', file: 'principle_2.md' },
  { number: 3, title: 'THE TETRIS EFFECT: TRAINING YOUR BRAIN TO CAPITALIZE ON POSSIBILITY', file: 'principle_3.md' },
  { number: 4, title: 'FALLING UP: CAPITALIZING ON THE DOWNS TO BUILD UPWARD MOMENTUM', file: 'principle_4.md' },
  { number: 5, title: 'THE ZORRO CIRCLE: HOW LIMITING YOUR FOCUS TO SMALL GOALS EXPANDS YOUR POWER', file: 'principle_5.md' },
  { number: 6, title: 'THE 20-SECOND RULE: HOW TO TURN BAD HABITS INTO GOOD ONES', file: 'principle_6.md' },
  { number: 7, title: 'SOCIAL INVESTMENT: WHY SOCIAL SUPPORT IS YOUR SINGLE GREATEST ASSET', file: 'principle_7.md' },
  { number: 8, title: 'THE RIPPLE EFFECT: SPREADING THE HAPPINESS ADVANTAGE', file: 'ripple_effect.md' },
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
    author: 'Shawn Achor',
    userId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return { id: docRef.id, title, author: 'Shawn Achor', userId };
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
    console.log('📚 The Happiness Advantage - Shawn Achor');
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
        console.log(`   [${meta.number}] 🔄 Updated: ${meta.title.substring(0, 50)}...`);
        updated++;
      } else {
        console.log(`   [${meta.number}] ✅ Added: ${meta.title.substring(0, 50)}...`);
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
