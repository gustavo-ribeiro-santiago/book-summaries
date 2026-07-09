const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';

// Expected schema for chapter docs:
//   bookId, chapterNumber, createdAt, summary, title, updatedAt, userId

async function migrateBook(bookDoc) {
  const bookId = bookDoc.id;
  const bookData = bookDoc.data();
  console.log(`\n📚 ${bookData.title} (${bookId})`);

  const chSnap = await db.collection('books').doc(bookId).collection('chapters').get();
  console.log(`   Found ${chSnap.size} chapter docs`);

  for (const ch of chSnap.docs) {
    const data = ch.data();
    const updates = {};
    const fieldsToDelete = {};

    // Ensure userId
    if (data.userId !== USER_ID) {
      updates.userId = USER_ID;
    }
    // Ensure bookId
    if (data.bookId !== bookId) {
      updates.bookId = bookId;
    }
    // Ensure chapterNumber (rename from `number` if needed)
    if (data.chapterNumber === undefined) {
      if (typeof data.number === 'number') {
        updates.chapterNumber = data.number;
      } else {
        console.log(`   ⚠️  ${ch.id}: no number/chapterNumber, skipping`);
        continue;
      }
    }
    // Remove old `number` field if it exists
    if (data.number !== undefined) {
      fieldsToDelete.number = admin.firestore.FieldValue.delete();
    }
    // Ensure createdAt / updatedAt exist
    if (!data.createdAt) {
      updates.createdAt = admin.firestore.FieldValue.serverTimestamp();
    }
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    const payload = { ...updates, ...fieldsToDelete };
    const changedKeys = Object.keys(payload).filter(k => k !== 'updatedAt');
    if (changedKeys.length === 0) {
      console.log(`   ✓ #${data.chapterNumber ?? data.number} already correct`);
      continue;
    }
    await ch.ref.update(payload);
    console.log(`   ↻ #${updates.chapterNumber ?? data.chapterNumber ?? data.number} updated: ${changedKeys.join(', ')}`);
  }
}

async function main() {
  const booksSnap = await db.collection('books')
    .where('userId', '==', USER_ID)
    .get();
  console.log(`Found ${booksSnap.size} books for user.`);

  for (const bookDoc of booksSnap.docs) {
    await migrateBook(bookDoc);
  }

  console.log('\n✅ Migration complete.');
  process.exit(0);
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
