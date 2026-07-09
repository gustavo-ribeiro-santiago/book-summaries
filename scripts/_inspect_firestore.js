const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';

const TITLES = [
  'Focus: The Hidden Driver of Excellence',
  'Chip War: The Fight for the World\'s Most Critical Technology',
  'AI Engineering: Building Applications with Foundation Models',
  'Justice: What\'s the Right Thing to Do?',
];

async function inspectBook(title) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📚 ${title}`);
  console.log('='.repeat(70));
  const snap = await db.collection('books')
    .where('userId', '==', USER_ID)
    .where('title', '==', title)
    .get();
  if (snap.empty) {
    console.log('  ❌ NOT FOUND');
    return;
  }
  for (const doc of snap.docs) {
    console.log(`Book ID: ${doc.id}`);
    console.log(`Data:`, JSON.stringify(doc.data(), null, 2));
    const chSnap = await db.collection('books').doc(doc.id).collection('chapters').orderBy('number').get();
    console.log(`\nChapters (${chSnap.size}):`);
    for (const ch of chSnap.docs) {
      const d = ch.data();
      const summaryLen = d.summary ? d.summary.length : 0;
      console.log(`  #${d.number} [${ch.id}] "${d.title}" — summary: ${summaryLen} chars`);
    }
  }
}

async function main() {
  for (const t of TITLES) {
    await inspectBook(t);
  }
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
