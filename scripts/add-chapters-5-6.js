/**
 * Script to add Chapters 5 and 6 of "How to Win Friends and Influence People" to Firestore
 * 
 * Prerequisites:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Download service account key from Firebase Console:
 *    - Go to Project Settings > Service Accounts
 *    - Click "Generate new private key"
 *    - Save as "serviceAccountKey.json" in this scripts folder
 * 3. Run: node scripts/add-chapters-5-6.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Configuration
const USER_ID = '5RCGILVnMvT1mrK0j7AfnuXAz8q2';
const BOOK_TITLE = 'How to Win Friends and Influence People';

// Chapter 5 content (markdown)
const chapter5Summary = `### **Core idea:**

**A simple smile is one of the most powerful tools for making a positive impression.**

Put simply: **your expression speaks louder than your words.**

---

### **The central principle**

A genuine smile communicates warmth, openness, and goodwill—instantly.

It costs nothing, takes no time, and yet creates enormous value in every interaction.

> Actions speak louder than words, and a smile says: "I like you. You make me happy. I'm glad to see you."

---

### **Why smiling works**

- It's universal—understood across all cultures
- It triggers positive feelings in others
- It makes you appear approachable and trustworthy
- It sets the tone for the entire interaction

People are naturally drawn to those who seem happy to see them.

---

### **The smile must be genuine**

Carnegie emphasizes that a fake, mechanical smile fools no one.

- An insincere grin is worse than no smile at all
- People can sense authenticity instantly
- A real smile comes from within—from genuine warmth

The goal isn't to *perform* happiness, but to *cultivate* it.

---

### **The psychology behind it**

- When you smile, you actually begin to feel happier
- Your mood influences your facial expression—and vice versa
- Acting cheerful can make you *become* cheerful

This creates a positive feedback loop:
> Smile → Feel better → Others respond positively → Feel even better → Smile more

---

### **Practical applications**

- **In business:** A smile over the phone can be "heard" in your voice
- **In meetings:** Start with warmth, not seriousness
- **In daily life:** Greet strangers with a smile—watch how they respond
- **At home:** Your family deserves your best expression, not your worst

---

### **The cost of not smiling**

- People with grim expressions are avoided
- Frowning creates distance and discomfort
- A sour face suggests you're unhappy to be there

Even if you're busy or stressed, a smile shows respect for the other person.

---

### **The emotional truth**

People don't remember what you said as much as how you made them feel.

A smile is often the first—and most lasting—impression you leave.

When you:
- Greet others with genuine warmth
- Let your face reflect goodwill
- Make others feel welcome

You open doors that remain closed to those who don't.

---

### **The chapter's principle**

> PRINCIPLE 2: Smile.

---

### **Bottom line**

If you want to:
- Make instant positive impressions
- Put others at ease
- Be remembered fondly

Then:
- Smile genuinely and often
- Let your face reflect the warmth you want others to feel
- Remember: your expression is the first thing people see

**A smile is the shortest distance between two people.**`;

// Chapter 6 content (markdown)
const chapter6Summary = `### **Core idea:**

**A person's name is, to that person, the sweetest and most important sound in any language.**

Put simply: **remember and use people's names.**

---

### **The central principle**

Remembering someone's name is a subtle but powerful compliment.

Forgetting it—or getting it wrong—suggests they don't matter to you.

> The name sets the individual apart; it makes them unique among all others.

---

### **Why names matter so much**

- A name represents identity and individuality
- It's deeply personal—chosen by parents, carried for life
- Using it shows respect, attention, and care
- Hearing your own name activates attention and emotion

When you remember someone's name, you're saying: *"You're important enough for me to remember."*

---

### **The power of using names**

Carnegie shares examples of leaders who mastered this:

- **Napoleon III** reportedly could remember the name of every person he met
- **Jim Farley** (political strategist) knew thousands of people by name and used this to build loyalty
- **Theodore Roosevelt** remembered the names of servants and staff—and won their devotion

These weren't tricks—they were investments in relationships.

---

### **Why people forget names**

- They don't pay attention during introductions
- They're thinking about what to say next
- They don't make the effort to repeat and reinforce the name
- They underestimate how much it matters

Forgetting a name is often a sign of **not truly listening**.

---

### **How to remember names**

1. **Pay attention** when you hear it—don't let it slip past
2. **Repeat it** back immediately: "Nice to meet you, Sarah"
3. **Use it** during the conversation naturally
4. **Associate it** with something memorable (a visual, a rhyme)
5. **Write it down** afterward if needed

The effort is small; the impact is enormous.

---

### **The emotional truth**

People feel valued when you remember their name.

They feel invisible when you don't.

When you:
- Make the effort to learn and use names
- Pronounce them correctly
- Recall them in future meetings

You communicate: *"You matter to me."*

---

### **Common mistakes to avoid**

- Mispronouncing names without asking for correction
- Using generic terms ("buddy," "man") instead of names
- Guessing instead of politely asking again
- Assuming names aren't important

If unsure, simply ask: *"I want to make sure I say your name correctly—how do you pronounce it?"*

---

### **The chapter's principle**

> PRINCIPLE 3: Remember that a person's name is to that person the sweetest and most important sound in any language.

---

### **Bottom line**

If you want to:
- Make people feel valued
- Build rapport quickly
- Be remembered as thoughtful and attentive

Then:
- Make a conscious effort to learn names
- Use them respectfully and often
- Never underestimate how much a name means to its owner

**A name isn't just a label—it's a bridge to connection.**`;

// Chapters data with UPPERCASE titles
const chaptersData = [
  {
    chapterNumber: 5,
    title: 'A SIMPLE WAY TO MAKE A GOOD FIRST IMPRESSION',
    summary: chapter5Summary
  },
  {
    chapterNumber: 6,
    title: 'IF YOU DON\'T DO THIS, YOU ARE HEADED FOR TROUBLE',
    summary: chapter6Summary
  }
];

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
    console.log(`   Chapter ${chapterData.chapterNumber} already exists. Updating...`);
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
      process.exit(1);
    }

    console.log('✅ Book found with ID:', book.id);

    // Add each chapter
    for (const chapter of chaptersData) {
      console.log(`\n📝 Adding Chapter ${chapter.chapterNumber}...`);
      
      const chapterFullData = {
        bookId: book.id,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        summary: chapter.summary,
        userId: USER_ID
      };

      const chapterId = await addChapter(book.id, chapterFullData);

      console.log(`   ✅ Chapter ${chapter.chapterNumber} added successfully!`);
      console.log(`   ID: ${chapterId}`);
      console.log(`   Title: ${chapter.title}`);
    }

    console.log('\n🎉 All chapters added successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

