'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBooks, createBook, deleteBook, Book } from '@/lib/firestore';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewBookModal, setShowNewBookModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadBooks();
    }
  }, [user]);

  const loadBooks = async () => {
    if (!user) return;
    try {
      const userBooks = await getUserBooks(user.uid);
      setBooks(userBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book? This will also delete all chapters.')) {
      return;
    }

    try {
      await deleteBook(bookId);
      setBooks(books.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="min-h-screen bg-paper-50 bg-pattern">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="font-serif text-3xl font-bold text-ink-900 mb-2">Your Library</h1>
            <p className="text-ink-600">
              {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
            </p>
          </div>
          <button
            onClick={() => setShowNewBookModal(true)}
            className="px-6 py-3 bg-accent-600 text-white rounded-xl font-semibold btn-hover hover:bg-accent-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Book
          </button>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-paper-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-paper-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-paper-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-paper-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-paper-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">No books yet</h3>
            <p className="text-ink-600 mb-6">Start building your library by adding your first book</p>
            <button
              onClick={() => setShowNewBookModal(true)}
              className="px-6 py-3 bg-accent-600 text-white rounded-xl font-semibold btn-hover hover:bg-accent-700 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Your First Book
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onDelete={handleDeleteBook} />
            ))}
          </div>
        )}
      </main>

      {/* New Book Modal */}
      {showNewBookModal && (
        <NewBookModal
          userId={user!.uid}
          onClose={() => setShowNewBookModal(false)}
          onCreated={(newBook) => {
            setBooks([newBook, ...books]);
            setShowNewBookModal(false);
          }}
        />
      )}
    </div>
  );
}

function BookCard({ book, onDelete }: { book: Book; onDelete: (id: string) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-paper-200 overflow-hidden card-hover group">
      <Link href={`/books/${book.id}`} className="block p-6">
        <h3 className="font-serif text-xl font-bold text-ink-900 mb-1 group-hover:text-accent-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-ink-500 text-sm mb-4">by {book.author}</p>
        {book.summary ? (
          <p className="text-ink-600 text-sm line-clamp-3">
            {book.summary.slice(0, 150)}...
          </p>
        ) : (
          <p className="text-ink-400 text-sm italic">No summary yet</p>
        )}
      </Link>
      <div className="px-6 py-4 bg-paper-50 border-t border-paper-200 flex justify-between items-center">
        <Link
          href={`/books/${book.id}`}
          className="text-accent-600 font-medium text-sm hover:text-accent-700 flex items-center gap-1"
        >
          View Book
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(book.id!);
          }}
          className="text-ink-400 hover:text-red-500 transition-colors"
          title="Delete book"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function NewBookModal({
  userId,
  onClose,
  onCreated,
}: {
  userId: string;
  onClose: () => void;
  onCreated: (book: Book) => void;
}) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookId = await createBook({
        title: title.trim(),
        author: author.trim(),
        userId,
      });
      
      onCreated({
        id: bookId,
        title: title.trim(),
        author: author.trim(),
        userId,
      } as Book);
    } catch (err) {
      console.error('Error creating book:', err);
      setError('Failed to create book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="font-serif text-2xl font-bold text-ink-900 mb-6">Add New Book</h2>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-ink-700 mb-2">
              Book Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-paper-50 border border-paper-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-ink-900 placeholder-ink-400"
              placeholder="e.g., Atomic Habits"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-ink-700 mb-2">
              Author
            </label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-3 bg-paper-50 border border-paper-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-ink-900 placeholder-ink-400"
              placeholder="e.g., James Clear"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-ink-600 hover:text-ink-900 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-accent-600 text-white rounded-xl font-semibold btn-hover hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

