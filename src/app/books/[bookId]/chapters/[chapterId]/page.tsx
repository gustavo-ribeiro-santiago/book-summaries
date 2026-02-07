'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import MarkdownEditor from '@/components/MarkdownEditor';
import { getBook, getChapter, getBookChapters, updateChapter, Book, Chapter } from '@/lib/firestore';

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
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadData();
  }, [bookId, chapterId]);

  const loadData = async () => {
    try {
      const [bookData, chapterData, chaptersData] = await Promise.all([
        getBook(bookId),
        getChapter(bookId, chapterId),
        getBookChapters(bookId),
      ]);

      if (!bookData || !chapterData) {
        router.push('/dashboard');
        return;
      }

      setBook(bookData);
      setChapter(chapterData);
      setAllChapters(chaptersData);
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

  // Find previous and next chapters
  const currentIndex = allChapters.findIndex((c) => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

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

        {/* Chapter Navigation */}
        <div className="mt-12 pt-8 border-t border-paper-200">
          <div className="flex items-center justify-between">
            {/* Previous Chapter */}
            <div className="flex-1">
              {prevChapter ? (
                <Link
                  href={`/books/${bookId}/chapters/${prevChapter.id}`}
                  className="group inline-flex flex-col items-start gap-1 text-left"
                >
                  <span className="text-sm text-ink-500 flex items-center gap-1 group-hover:text-accent-600 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous Chapter
                  </span>
                  <span className="font-medium text-ink-700 group-hover:text-accent-600 transition-colors line-clamp-1">
                    {prevChapter.chapterNumber}. {prevChapter.title}
                  </span>
                </Link>
              ) : (
                <Link
                  href={`/books/${bookId}`}
                  className="inline-flex items-center gap-2 text-ink-500 hover:text-accent-600 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back to Book
                </Link>
              )}
            </div>

            {/* Center: Back to Book */}
            <div className="hidden sm:flex flex-shrink-0 mx-4">
              <Link
                href={`/books/${bookId}`}
                className="px-4 py-2 bg-paper-100 hover:bg-paper-200 rounded-lg text-ink-600 hover:text-ink-900 font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                All Chapters
              </Link>
            </div>

            {/* Next Chapter */}
            <div className="flex-1 flex justify-end">
              {nextChapter ? (
                <Link
                  href={`/books/${bookId}/chapters/${nextChapter.id}`}
                  className="group inline-flex flex-col items-end gap-1 text-right"
                >
                  <span className="text-sm text-ink-500 flex items-center gap-1 group-hover:text-accent-600 transition-colors">
                    Next Chapter
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="font-medium text-ink-700 group-hover:text-accent-600 transition-colors line-clamp-1">
                    {nextChapter.chapterNumber}. {nextChapter.title}
                  </span>
                </Link>
              ) : (
                <Link
                  href={`/books/${bookId}`}
                  className="inline-flex items-center gap-2 text-ink-500 hover:text-accent-600 transition-colors"
                >
                  Finish Book
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Chapter Progress Indicator */}
          {allChapters.length > 1 && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-ink-500 mb-2">
                <span>Chapter {chapter.chapterNumber} of {allChapters.length}</span>
                <span>{Math.round(((currentIndex + 1) / allChapters.length) * 100)}% complete</span>
              </div>
              <div className="w-full bg-paper-200 rounded-full h-2">
                <div
                  className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / allChapters.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
