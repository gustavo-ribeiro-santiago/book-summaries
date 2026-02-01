'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-soft">
          <svg className="w-12 h-12 text-accent-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-paper-400 rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20">
          {/* Header */}
          <header className="flex justify-between items-center mb-20">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-accent-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-serif text-xl font-bold text-ink-900">Book Summaries</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-5 py-2.5 text-ink-700 hover:text-ink-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-accent-600 text-white rounded-lg font-medium btn-hover hover:bg-accent-700"
              >
                Get Started
              </Link>
            </div>
          </header>

          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink-900 mb-6 leading-tight">
              Capture the Essence of
              <span className="text-accent-600"> Every Book</span>
            </h1>
            <p className="text-xl text-ink-600 mb-10 leading-relaxed">
              Create beautiful summaries for your favorite books. Organize chapter notes, 
              highlight key insights, and build your personal library of knowledge.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-accent-600 text-white rounded-xl font-semibold text-lg btn-hover hover:bg-accent-700 flex items-center gap-2"
              >
                Start Your Library
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-32 grid md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-paper-200 card-hover">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-accent-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-ink-900 mb-3">Book Summaries</h3>
              <p className="text-ink-600">
                Create comprehensive summaries that capture the main ideas and themes of each book you read.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-paper-200 card-hover">
              <div className="w-12 h-12 bg-paper-200 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-paper-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-ink-900 mb-3">Chapter Notes</h3>
              <p className="text-ink-600">
                Break down books chapter by chapter. Never lose track of important details and insights.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-paper-200 card-hover">
              <div className="w-12 h-12 bg-ink-100 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-ink-900 mb-3">Markdown Support</h3>
              <p className="text-ink-600">
                Write your summaries in Markdown for beautiful formatting with headers, lists, and more.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-paper-200 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-ink-500">
          <p>© 2026 Book Summaries. Built for book lovers.</p>
        </div>
      </footer>
    </div>
  );
}

