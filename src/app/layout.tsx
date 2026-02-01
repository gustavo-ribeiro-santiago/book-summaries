import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Book Summaries - Your Personal Library of Insights',
  description: 'Create and organize summaries for your favorite books and chapters',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper-50 bg-pattern">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

