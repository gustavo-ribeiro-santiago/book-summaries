'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import MarkdownEditor from '@/components/MarkdownEditor';
import { getBook, getChapter, updateChapter, Book, Chapter } from '@/lib/firestore';

export default function ChapterPage({
  params,
}: {
  params: Promise<{ bookId: string; chapterId: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <ProtectedRoute>
      <ChapterDetail bookId={resolvedParams.bookId} chapterId={resolvedParams.chapterId} />
    </ProtectedRoute>
  );
}

function ChapterDetail({ bookId, chapterId }: { bookId: string; chapterId: string }) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadData();
  }, [bookId, chapterId]);

  const loadData = async () => {
    try {
      const [bookData, chapterData] = await Promise.all([
        getBook(bookId),
        getChapter(bookId, chapterId),
      ]);

      if (!bookData || !chapterData) {
        router.push('/dashboard');
        return;
      }

      setBook(bookData);
      setChapter(chapterData);
    } catch (error) {
      console.error('Error loading chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSummary = async (summary: string) => {
    try {
      await updateChapter(bookId, chapterId, { summary });
      setChapter({ ...chapter!, summary });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving chapter summary:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-50 bg-pattern">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-10">
          <div className="animate-pulse">
            <div className="h-4 bg-paper-200 rounded w-1/4 mb-6"></div>
            <div className="h-8 bg-paper-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-paper-200 rounded w-1/2 mb-8"></div>
            <div className="h-60 bg-paper-100 rounded-xl"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!book || !chapter) {
    return null;
  }

  return (
    <div className="min-h-screen bg-paper-50 bg-pattern">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="text-ink-500 hover:text-accent-600 transition-colors"
          >
            Library
          </Link>
          <svg className="w-4 h-4 text-ink-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <Link
            href={`/books/${bookId}`}
            className="text-ink-500 hover:text-accent-600 transition-colors"
          >
            {book.title}
          </Link>
          <svg className="w-4 h-4 text-ink-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-ink-700 font-medium">Chapter {chapter.chapterNumber}</span>
        </nav>

        {/* Chapter Header */}
        <div className="mb-10">
          <span className="text-accent-600 font-semibold text-lg">
            Chapter {chapter.chapterNumber}
          </span>
          <h1 className="font-serif text-4xl font-bold text-ink-900 mt-2 mb-4">
            {chapter.title}
          </h1>
          <p className="text-ink-600">
            From <span className="font-medium">{book.title}</span> by {book.author}
          </p>
        </div>

        {/* Chapter Summary Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl font-bold text-ink-900">Chapter Summary</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-accent-600 hover:text-accent-700 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                {chapter.summary ? 'Edit Summary' : 'Add Summary'}
              </button>
            )}
          </div>

          {isEditing ? (
            <MarkdownEditor
              initialContent={chapter.summary || ''}
              onSave={handleSaveSummary}
              onCancel={() => setIsEditing(false)}
              placeholder="Write your chapter summary here. Use Markdown to format your notes with headings, lists, quotes, and more..."
            />
          ) : (
            <div className="bg-white rounded-2xl border border-paper-200 p-8">
              <MarkdownRenderer content={chapter.summary || ''} />
            </div>
          )}
        </section>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-paper-200">
          <Link
            href={`/books/${bookId}`}
            className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Book
          </Link>
        </div>
      </main>
    </div>
  );
}

