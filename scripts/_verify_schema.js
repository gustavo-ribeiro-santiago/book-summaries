const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';

const EXPECTED = ['bookId', 'chapterNumber', 'createdAt', 'summary', 'title', 'updatedAt', 'userId'];

async function main() {
  const booksSnap = await db.collection('books').where('userId', '==', USER_ID).get();
  let totalChapters = 0;
  let badChapters = 0;

  for (const bookDoc of booksSnap.docs) {
    const chSnap = await db.collection('books').doc(bookDoc.id).collection('chapters').get();
    for (const ch of chSnap.docs) {
      totalChapters++;
      const data = ch.data();
      const keys = Object.keys(data).sort();
      const missing = EXPECTED.filter(k => !keys.includes(k));
      const extra = keys.filter(k => !EXPECTED.includes(k));
      if (missing.length || extra.length) {
        badChapters++;
        console.log(`❌ ${bookDoc.data().title} / ch ${data.chapterNumber ?? data.number ?? '?'} [${ch.id}]`);
        if (missing.length) console.log(`     missing: ${missing.join(', ')}`);
        if (extra.length) console.log(`     extra:   ${extra.join(', ')}`);
      }
    }
  }

  console.log(`\n${totalChapters - badChapters}/${totalChapters} chapter docs match expected schema.`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
