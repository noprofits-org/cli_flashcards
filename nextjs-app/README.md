# CLI Flashcards - Next.js + JSON

A modern flashcard application for learning CLI commands, built with Next.js and JSON-based data storage.

## Features

- **29 Basic Flashcards** - Master fundamental clasp commands
- **27 Advanced Flashcards** - Learn command flags and options
- **Modern Stack** - Next.js 16, TypeScript, Tailwind CSS
- **Mobile-First Design** - Optimized for all devices
- **Dark Mode** - Automatic system preference detection
- **Static Data** - Simple JSON-based flashcard storage
- **Real-Time Validation** - Instant answer checking
- **Keyboard Navigation** - Arrow keys, Enter to submit/continue
- **Hard Mode** - 3-retry challenge system for mastery

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Data Storage:** JSON files (static)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript 5
- **Deployment:** Vercel
- **Animation:** Framer Motion
- **State Management:** React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Git (for cloning and version control)

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 3. Build for Production

```bash
npm run build
npm start
```

## Data Management

Flashcard data is stored in `/data/flashcards.json`. The structure is:

```json
{
  "clasp-basics": [
    {
      "task": "What to accomplish",
      "answer": "The CLI command",
      "description": "What it does",
      "whenToUse": "When to use it",
      "scenarios": ["Example scenario 1", "Example scenario 2"]
    }
  ],
  "clasp-advanced": [...]
}
```

To add or modify flashcards, simply edit the JSON file. No database migrations needed!

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

3. **Deploy:**
   - Click "Deploy" and wait for the build to complete
   - No environment variables needed!

## Project Structure

```
nextjs-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── flashcards/       # Flashcard data endpoints
│   │   ├── practice/         # Answer validation
│   │   └── progress/         # Session tracking
│   ├── flashcards/[setId]/   # Flashcard session page
│   ├── results/              # Results page
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                   # Reusable UI components
│   └── flashcards/           # Flashcard-specific components
├── data/
│   └── flashcards.json       # Flashcard data storage
├── lib/
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
└── public/                   # Static assets
```

## License

MIT License - feel free to use for learning and teaching!

---

**Happy Learning! Master CLI commands one card at a time.** 📚
