# CLI Flashcards - Next.js + Supabase

A modern flashcard application for learning CLI commands, migrated from Google Apps Script to Next.js + Supabase stack.

## Features

- **29 Basic Flashcards** - Master fundamental clasp commands
- **27 Advanced Flashcards** - Learn command flags and options
- **Modern Stack** - Next.js 14, Supabase, TypeScript, Tailwind CSS
- **Mobile-First Design** - Optimized for all devices
- **Dark Mode** - Automatic system preference detection
- **Progress Tracking** - Save your learning progress
- **Guest Mode** - No login required to start learning
- **Real-Time Validation** - Instant answer checking
- **Keyboard Navigation** - Arrow keys, Enter to submit/continue

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel
- **Animation:** Framer Motion
- **State Management:** React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- Git (for cloning and version control)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** → **API** and copy:
   - Project URL
   - Anon/Public key

3. Run the database migrations:
   - Go to **SQL Editor** in Supabase dashboard
   - Copy and run `supabase/migrations/001_initial_schema.sql`
   - Then run `supabase/migrations/002_seed_data.sql`

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Update the values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add Environment Variables:**
   In Vercel project settings, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy:**
   Click "Deploy" and wait for the build to complete

## Project Structure

```
nextjs-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── flashcards/[setId]/   # Flashcard session page
│   ├── results/              # Results page
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                   # Reusable UI components
│   └── flashcards/           # Flashcard-specific components
├── lib/
│   ├── supabase/             # Supabase client configuration
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
├── supabase/
│   └── migrations/           # Database schema and seed data
└── public/                   # Static assets
```

## Documentation

- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Detailed migration from Apps Script

## License

MIT License - feel free to use for learning and teaching!

---

**Happy Learning! Master CLI commands one card at a time.** 📚
