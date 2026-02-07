/**
 * Script to add all chapters of "How to Win Friends and Influence People" to Firestore
 * Reads chapter summaries from the summaries/hwfip folder
 * 
 * Prerequisites:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Download service account key from Firebase Console
 * 3. Save as "serviceAccountKey.json" in this scripts folder
 * 4. Run: node scripts/add-all-chapters.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Configuration
const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';
const BOOK_TITLE = 'How to Win Friends and Influence People';
const SUMMARIES_DIR = path.join(__dirname, '..', 'summaries', 'hwfip');

// Chapter metadata (titles in UPPERCASE)
const chaptersMetadata = [
  // Part One: Fundamental Techniques in Handling People
  { number: 1, title: "IF YOU WANT TO GATHER HONEY, DON'T KICK OVER THE BEEHIVE" },
  { number: 2, title: "THE BIG SECRET OF DEALING WITH PEOPLE" },
  { number: 3, title: "HE WHO CAN DO THIS HAS THE WHOLE WORLD WITH HIM. HE WHO CANNOT WALKS A LONELY WAY" },
  
  // Part Two: Ways to Make People Like You
  { number: 4, title: "DO THIS AND YOU'LL BE WELCOME ANYWHERE" },
  { number: 5, title: "A SIMPLE WAY TO MAKE A GOOD FIRST IMPRESSION" },
  { number: 6, title: "IF YOU DON'T DO THIS, YOU ARE HEADED FOR TROUBLE" },
  { number: 7, title: "AN EASY WAY TO BECOME A GOOD CONVERSATIONALIST" },
  { number: 8, title: "HOW TO INTEREST PEOPLE" },
  { number: 9, title: "HOW TO MAKE PEOPLE LIKE YOU INSTANTLY" },
  
  // Part Three: How to Win People to Your Way of Thinking
  { number: 10, title: "YOU CAN'T WIN AN ARGUMENT" },
  { number: 11, title: "A SURE WAY OF MAKING ENEMIES—AND HOW TO AVOID IT" },
  { number: 12, title: "IF YOU'RE WRONG, ADMIT IT" },
  { number: 13, title: "A DROP OF HONEY" },
  { number: 14, title: "THE SECRET OF SOCRATES" },
  { number: 15, title: "THE SAFETY VALVE IN HANDLING COMPLAINTS" },
  { number: 16, title: "HOW TO GET COOPERATION" },
  { number: 17, title: "A FORMULA THAT WILL WORK WONDERS FOR YOU" },
  { number: 18, title: "WHAT EVERYBODY WANTS" },
  { number: 19, title: "AN APPEAL THAT EVERYBODY LIKES" },
  { number: 20, title: "THE MOVIES DO IT. TV DOES IT...WHY DON'T YOU DO IT?" },
  { number: 21, title: "WHEN NOTHING ELSE WORKS, TRY THIS" },
  
  // Part Four: Be a Leader
  { number: 22, title: "IF YOU MUST FIND FAULT, THIS IS THE WAY TO BEGIN" },
  { number: 23, title: "HOW TO CRITICIZE...AND NOT BE HATED FOR IT" },
  { number: 24, title: "TALK ABOUT YOUR OWN MISTAKES FIRST" },
  { number: 25, title: "NO ONE LIKES TO TAKE ORDERS" },
  { number: 26, title: "LET THE OTHER PERSON SAVE FACE" },
  { number: 27, title: "HOW TO SPUR PEOPLE ON TO SUCCESS" },
  { number: 28, title: "GIVE A DOG A GOOD NAME" },
  { number: 29, title: "MAKE THE FAULT SEEM EASY TO CORRECT" },
  { number: 30, title: "MAKING PEOPLE GLAD TO DO WHAT YOU WANT" },
];

function readChapterSummary(chapterNumber) {
  const filePath = path.join(SUMMARIES_DIR, `chapter_${chapterNumber}.md`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  Summary file not found: chapter_${chapterNumber}.md`);
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

async function addOrUpdateChapter(bookId, chapterData) {
  const chaptersRef = db.collection('books').doc(bookId).collection('chapters');
  
  // Check if chapter already exists
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

  // Create new chapter
  const docRef = await chaptersRef.add({
    ...chapterData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { id: docRef.id, updated: false };
}

async function main() {
  try {
    console.log('📚 How to Win Friends and Influence People');
    console.log('   Uploading all chapters to Firestore\n');
    console.log('🔍 Finding book for user:', USER_ID);

    // Find the book
    const book = await findBookByTitle(USER_ID, BOOK_TITLE);

    if (!book) {
      console.error('❌ Book not found! Please make sure the book exists for this user.');
      console.log('\nTo create the book, add it through the web app first.');
      process.exit(1);
    }

    console.log('✅ Book found with ID:', book.id);
    console.log('\n📝 Processing chapters...\n');

    let added = 0;
    let updated = 0;
    let skipped = 0;

    // Process each chapter
    for (const meta of chaptersMetadata) {
      const summary = readChapterSummary(meta.number);
      
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
        console.log(`   [${meta.number}] 🔄 Updated: ${meta.title.substring(0, 40)}...`);
        updated++;
      } else {
        console.log(`   [${meta.number}] ✅ Added: ${meta.title.substring(0, 40)}...`);
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

