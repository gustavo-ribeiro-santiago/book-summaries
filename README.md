# Book Summaries

A beautiful web app to create and organize summaries for your favorite books and chapters. Built with Next.js 14 and Firebase.

## Features

- **User Authentication** - Sign up/login with email or Google
- **Book Management** - Add, edit, and delete books from your personal library
- **Book Summaries** - Write comprehensive summaries for each book
- **Chapter Notes** - Break down books into chapters with individual summaries
- **Markdown Support** - Write summaries in Markdown with live preview
- **Beautiful UI** - Modern, paper-inspired design with smooth animations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Deployment**: Vercel (frontend), Firebase (backend)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account

### 1. Clone and Install

```bash
cd book-summaries
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** with Email/Password and Google providers
3. Create a **Firestore Database** in production mode
4. Go to Project Settings > General > Your apps and add a Web app
5. Copy the configuration values

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Firestore Rules

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (select your project, choose Firestore)
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel](https://vercel.com) and import your GitHub repository
2. Add the environment variables (same as `.env.local`)
3. Deploy!

### 3. Deploy Firebase Functions (Optional)

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

## Project Structure

```
book-summaries/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Main dashboard (book list)
│   │   ├── books/[bookId]/     # Book detail page
│   │   │   └── chapters/[chapterId]/  # Chapter page
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   └── page.tsx            # Landing page
│   ├── components/             # Reusable components
│   │   ├── MarkdownEditor.tsx  # Markdown editor with preview
│   │   ├── MarkdownRenderer.tsx # Markdown to HTML renderer
│   │   ├── Navbar.tsx          # Navigation bar
│   │   └── ProtectedRoute.tsx  # Auth guard component
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx     # Authentication context
│   └── lib/                    # Utilities and Firebase
│       ├── firebase.ts         # Firebase initialization
│       └── firestore.ts        # Firestore operations
├── functions/                  # Firebase Cloud Functions
│   └── src/index.ts           # Function definitions
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore indexes
└── firebase.json              # Firebase configuration
```

## Firestore Data Model

```
books (collection)
├── {bookId}
│   ├── title: string
│   ├── author: string
│   ├── summary: string (markdown)
│   ├── userId: string
│   ├── createdAt: timestamp
│   ├── updatedAt: timestamp
│   └── chapters (subcollection)
│       └── {chapterId}
│           ├── title: string
│           ├── chapterNumber: number
│           ├── summary: string (markdown)
│           ├── bookId: string
│           ├── userId: string
│           ├── createdAt: timestamp
│           └── updatedAt: timestamp
```

## License

MIT

