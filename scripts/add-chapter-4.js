/**
 * Script to add Chapter 4 of "How to Win Friends and Influence People" to Firestore
 * 
 * Prerequisites:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Download service account key from Firebase Console:
 *    - Go to Project Settings > Service Accounts
 *    - Click "Generate new private key"
 *    - Save as "serviceAccountKey.json" in this scripts folder
 * 3. Run: node scripts/add-chapter-4.js
 */

const admin = require('firebase-admin');
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

// Chapter 4 content (markdown)
const chapter4Summary = `### **Core idea:**

**Become genuinely interested in other people—and they will be drawn to you.**

Put simply: **to be interesting, be interested.**

---

### **The central principle**

You can make more friends in two months by becoming **genuinely interested in other people** than you can in two years by trying to get other people interested in you.

The key word is *genuine*. Fake interest is transparent and repels people.

---

### **The dog analogy**

Carnegie uses the example of a dog:

- A dog doesn't need to read books on how to win friends
- A dog is loved because it shows **unconditional, genuine interest** in people
- When you come home, a dog acts like you're the most important person in the world

**People respond the same way to genuine attention and interest.**

---

### **Why self-focus fails**

- People who only talk about themselves are boring
- Those who only think of what they can get are avoided
- Trying to impress others makes you seem needy

The irony:
> The person who tries hardest to be interesting is often the least interesting.

---

### **What genuine interest looks like**

- Remembering names and details about people's lives
- Asking questions about their interests, not yours
- Following up on things they've shared before
- Showing enthusiasm for what matters to them

This applies everywhere:
- Business relationships
- Personal friendships
- Family connections
- Brief encounters

---

### **Examples from Carnegie**

- A magician (Howard Thurston) attributed his success to loving his audience genuinely
- Theodore Roosevelt was beloved because he showed real interest in everyone—from servants to senators
- Successful salespeople focus on understanding customers, not pitching products

---

### **Why this principle is powerful**

- People are starving for attention and recognition
- Most people feel invisible and unimportant
- When you show genuine interest, you become memorable

> "We are interested in others when they are interested in us." — Publilius Syrus

---

### **The emotional truth**

People don't care how impressive you are.

They care how you make *them* feel.

When you:
- Listen with curiosity
- Show authentic interest
- Make others feel valued

You become someone people want to be around.

---

### **The chapter's principle**

> PRINCIPLE 1: Become genuinely interested in other people.

---

### **Bottom line**

If you want to:
- Make friends easily
- Build lasting relationships
- Be welcome anywhere you go

Then:
- Stop trying to impress people
- Start being curious about them
- Show genuine interest in their lives, dreams, and struggles

**Do this, and you'll be welcome anywhere. Ignore it, and you'll wonder why people don't seek your company.**`;

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

async function addChapter(bookId, chapterData) {
  const chaptersRef = db.collection('books').doc(bookId).collection('chapters');
  
  // Check if chapter already exists
  const existingChapter = await chaptersRef
    .where('chapterNumber', '==', chapterData.chapterNumber)
    .get();

  if (!existingChapter.empty) {
    console.log(`Chapter ${chapterData.chapterNumber} already exists. Updating...`);
    const docId = existingChapter.docs[0].id;
    await chaptersRef.doc(docId).update({
      ...chapterData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return docId;
  }

  // Create new chapter
  const docRef = await chaptersRef.add({
    ...chapterData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return docRef.id;
}

async function main() {
  try {
    console.log('🔍 Finding book for user:', USER_ID);
    console.log('📚 Book title:', BOOK_TITLE);

    // Find the book
    const book = await findBookByTitle(USER_ID, BOOK_TITLE);

    if (!book) {
      console.error('❌ Book not found! Please make sure the book exists for this user.');
      console.log('\nTo create the book first, you can run:');
      console.log('node scripts/create-book.js');
      process.exit(1);
    }

    console.log('✅ Book found with ID:', book.id);

    // Chapter 4 data
    const chapter4Data = {
      bookId: book.id,
      title: 'DO THIS AND YOU\'LL BE WELCOME ANYWHERE',
      chapterNumber: 4,
      summary: chapter4Summary,
      userId: USER_ID
    };

    console.log('\n📝 Adding Chapter 4...');
    const chapterId = await addChapter(book.id, chapter4Data);

    console.log('✅ Chapter 4 added successfully!');
    console.log('   Chapter ID:', chapterId);
    console.log('   Title:', chapter4Data.title);
    console.log('   Chapter Number:', chapter4Data.chapterNumber);

    console.log('\n🎉 Done!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

