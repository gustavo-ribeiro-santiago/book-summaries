import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Book {
  id?: string;
  title: string;
  author: string;
  coverUrl?: string;
  summary?: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Chapter {
  id?: string;
  bookId: string;
  title: string;
  chapterNumber: number;
  summary?: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Books Collection
export const booksCollection = collection(db, 'books');

export async function createBook(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(booksCollection, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getBook(bookId: string): Promise<Book | null> {
  const docRef = doc(db, 'books', bookId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Book;
  }
  return null;
}

export async function getUserBooks(userId: string): Promise<Book[]> {
  const q = query(
    booksCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Book[];
}

export async function updateBook(bookId: string, data: Partial<Book>) {
  const docRef = doc(db, 'books', bookId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBook(bookId: string) {
  const docRef = doc(db, 'books', bookId);
  await deleteDoc(docRef);
}

// Chapters Collection
export async function createChapter(data: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>) {
  const chaptersCollection = collection(db, 'books', data.bookId, 'chapters');
  const docRef = await addDoc(chaptersCollection, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getChapter(bookId: string, chapterId: string): Promise<Chapter | null> {
  const docRef = doc(db, 'books', bookId, 'chapters', chapterId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Chapter;
  }
  return null;
}

export async function getBookChapters(bookId: string): Promise<Chapter[]> {
  const chaptersCollection = collection(db, 'books', bookId, 'chapters');
  const q = query(chaptersCollection, orderBy('chapterNumber', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Chapter[];
}

export async function updateChapter(bookId: string, chapterId: string, data: Partial<Chapter>) {
  const docRef = doc(db, 'books', bookId, 'chapters', chapterId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteChapter(bookId: string, chapterId: string) {
  const docRef = doc(db, 'books', bookId, 'chapters', chapterId);
  await deleteDoc(docRef);
}

