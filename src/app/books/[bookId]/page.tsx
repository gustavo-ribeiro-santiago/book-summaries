'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import MarkdownEditor from '@/components/MarkdownEditor';
import { useAuth } from '@/contexts/AuthContext';
import {
  getBook,
  updateBook,
  getBookChapters,
  createChapter,
  deleteChapter,
  Book,
  Chapter,
} from '@/lib/firestore';

export default function BookPage({ params }: { params: Promise<{ bookId: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <ProtectedRoute>
      <BookDetail bookId={resolvedParams.bookId} />
    </ProtectedRoute>
  );
}

function BookDetail({ bookId }: { bookId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [showNewChapterModal, setShowNewChapterModal] = useState(false);

  useEffect(() => {
    loadBookData();
  }, [bookId]);

  const loadBookData = async () => {
    try {
      const [bookData, chaptersData] = await Promise.all([
        getBook(bookId),
        getBookChapters(bookId),
      ]);

      if (!bookData) {
        router.push('/dashboard');
        return;
      }

      setBook(bookData);
      setChapters(chaptersData);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSummary = async (summary: string) => {
    try {
      await updateBook(bookId, { summary });
      setBook({ ...book!, summary });
      setIsEditingSummary(false);
    } catch (error) {
      console.error('Error saving summary:', error);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) {
      return;
    }

    try {
      await deleteChapter(bookId, chapterId);
      setChapters(chapters.filter((c) => c.id !== chapterId));
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-50 bg-pattern">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-10">
          <div className="animate-pulse">
            <div className="h-8 bg-paper-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-paper-200 rounded w-1/4 mb-8"></div>
            <div className="h-40 bg-paper-100 rounded-xl"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="min-h-screen bg-paper-50 bg-pattern">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/dashboard"
            className="text-accent-600 hover:text-accent-700 font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Library
          </Link>
        </nav>

        {/* Book Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold text-ink-900 mb-2">{book.title}</h1>
          <p className="text-xl text-ink-600">by {book.author}</p>
        </div>

        {/* Book Summary Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl font-bold text-ink-900">Book Summary</h2>
            {!isEditingSummary && (
              <button
                onClick={() => setIsEditingSummary(true)}
                className="px-4 py-2 text-accent-600 hover:text-accent-700 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                {book.summary ? 'Edit Summary' : 'Add Summary'}
              </button>
            )}
          </div>

          {isEditingSummary ? (
            <MarkdownEditor
              initialContent={book.summary || ''}
              onSave={handleSaveSummary}
              onCancel={() => setIsEditingSummary(false)}
              placeholder="Write your book summary here. You can use Markdown formatting..."
            />
          ) : (
            <div className="bg-white rounded-2xl border border-paper-200 p-8">
              <MarkdownRenderer content={book.summary || ''} />
            </div>
          )}
        </section>

        {/* Chapters Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl font-bold text-ink-900">Chapters</h2>
            <button
              onClick={() => setShowNewChapterModal(true)}
              className="px-4 py-2 bg-accent-600 text-white rounded-lg font-medium btn-hover hover:bg-accent-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Chapter
            </button>
          </div>

          {chapters.length === 0 ? (
            <div className="bg-white rounded-2xl border border-paper-200 p-12 text-center">
              <div className="w-16 h-16 bg-paper-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-paper-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">No chapters yet</h3>
              <p className="text-ink-600 mb-4">Break down this book into chapters and add summaries for each one</p>
              <button
                onClick={() => setShowNewChapterModal(true)}
                className="text-accent-600 font-medium hover:text-accent-700"
              >
                Add your first chapter →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  bookId={bookId}
                  onDelete={handleDeleteChapter}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* New Chapter Modal */}
      {showNewChapterModal && (
        <NewChapterModal
          bookId={bookId}
          userId={user!.uid}
          nextChapterNumber={chapters.length + 1}
          onClose={() => setShowNewChapterModal(false)}
          onCreated={(newChapter) => {
            setChapters([...chapters, newChapter].sort((a, b) => a.chapterNumber - b.chapterNumber));
            setShowNewChapterModal(false);
          }}
        />
      )}
    </div>
  );
}

function ChapterCard({
  chapter,
  bookId,
  onDelete,
}: {
  chapter: Chapter;
  bookId: string;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-paper-200 overflow-hidden card-hover group">
      <Link href={`/books/${bookId}/chapters/${chapter.id}`} className="block p-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-accent-600 font-medium text-sm">
              Chapter {chapter.chapterNumber}
            </span>
            <h3 className="font-serif text-lg font-bold text-ink-900 group-hover:text-accent-600 transition-colors">
              {chapter.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/books/${bookId}/chapters/${chapter.id}`}
              className="text-accent-600 font-medium text-sm hover:text-accent-700 flex items-center gap-1"
            >
              View
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete(chapter.id!);
              }}
              className="text-ink-400 hover:text-red-500 transition-colors p-1"
              title="Delete chapter"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        {chapter.summary && (
          <p className="text-ink-600 text-sm mt-2 line-clamp-2">
            {chapter.summary.slice(0, 120)}...
          </p>
        )}
      </Link>
    </div>
  );
}

function NewChapterModal({
  bookId,
  userId,
  nextChapterNumber,
  onClose,
  onCreated,
}: {
  bookId: string;
  userId: string;
  nextChapterNumber: number;
  onClose: () => void;
  onCreated: (chapter: Chapter) => void;
}) {
  const [title, setTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState(nextChapterNumber);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a chapter title');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const chapterId = await createChapter({
        bookId,
        title: title.trim(),
        chapterNumber,
        userId,
      });

      onCreated({
        id: chapterId,
        bookId,
        title: title.trim(),
        chapterNumber,
        userId,
      } as Chapter);
    } catch (err) {
      console.error('Error creating chapter:', err);
      setError('Failed to create chapter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="font-serif text-2xl font-bold text-ink-900 mb-6">Add New Chapter</h2>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="chapterNumber" className="block text-sm font-medium text-ink-700 mb-2">
              Chapter Number
            </label>
            <input
              id="chapterNumber"
              type="number"
              min="1"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 bg-paper-50 border border-paper-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-ink-900"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-ink-700 mb-2">
              Chapter Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-paper-50 border border-paper-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-ink-900 placeholder-ink-400"
              placeholder="e.g., The Surprising Power of Small Habits"
              autoFocus
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
              {loading ? 'Creating...' : 'Create Chapter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

