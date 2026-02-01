import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

/**
 * Cloud Function: Delete all chapters when a book is deleted
 * This function triggers when a book document is deleted and
 * automatically removes all associated chapters.
 */
export const onBookDeleted = functions.firestore
  .document('books/{bookId}')
  .onDelete(async (snap, context) => {
    const bookId = context.params.bookId;
    
    try {
      // Get all chapters for this book
      const chaptersSnapshot = await db
        .collection('books')
        .doc(bookId)
        .collection('chapters')
        .get();
      
      // Delete all chapters in batches
      const batch = db.batch();
      chaptersSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      
      console.log(`Deleted ${chaptersSnapshot.size} chapters for book ${bookId}`);
    } catch (error) {
      console.error('Error deleting chapters:', error);
      throw error;
    }
  });

/**
 * Cloud Function: Count chapters for a book
 * This callable function returns the number of chapters in a book
 */
export const getChapterCount = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to call this function'
    );
  }

  const { bookId } = data;
  
  if (!bookId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Book ID is required'
    );
  }

  try {
    // Verify user owns the book
    const bookDoc = await db.collection('books').doc(bookId).get();
    
    if (!bookDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Book not found');
    }

    const bookData = bookDoc.data();
    if (bookData?.userId !== context.auth.uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'User does not have access to this book'
      );
    }

    // Count chapters
    const chaptersSnapshot = await db
      .collection('books')
      .doc(bookId)
      .collection('chapters')
      .count()
      .get();

    return { count: chaptersSnapshot.data().count };
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    console.error('Error counting chapters:', error);
    throw new functions.https.HttpsError('internal', 'Failed to count chapters');
  }
});

/**
 * Cloud Function: Get user statistics
 * Returns the total number of books and chapters for a user
 */
export const getUserStats = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to call this function'
    );
  }

  const userId = context.auth.uid;

  try {
    // Count user's books
    const booksSnapshot = await db
      .collection('books')
      .where('userId', '==', userId)
      .count()
      .get();

    const bookCount = booksSnapshot.data().count;

    // Get all books to count chapters
    const booksQuery = await db
      .collection('books')
      .where('userId', '==', userId)
      .get();

    let chapterCount = 0;
    
    // Count chapters for each book
    for (const bookDoc of booksQuery.docs) {
      const chaptersSnapshot = await bookDoc.ref
        .collection('chapters')
        .count()
        .get();
      chapterCount += chaptersSnapshot.data().count;
    }

    return {
      bookCount,
      chapterCount,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get user statistics');
  }
});

