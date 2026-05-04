# CLI Flashcards

Interactive flashcards for learning command-line tools — Terminal, Git, CLASP, Firebase, and Google Cloud.

## Quick start

```bash
cd nextjs-app
npm install
npm run dev
```

Open http://localhost:3000.

## What's in here

The app lives in [`nextjs-app/`](./nextjs-app/) — a Next.js 16 (App Router) site with React 19 and Tailwind 4. All flashcard, guide, and project content is static JSON under `nextjs-app/data/`.

```
cli_flashcards/
├── nextjs-app/
│   ├── app/           # Pages and API routes (App Router)
│   ├── components/    # UI components (flashcards, projects, primitives)
│   ├── data/          # Flashcard, guide, and project content (JSON)
│   ├── lib/           # Hooks, types, utilities, data registry
│   └── README.md      # Setup, deployment, content authoring
└── README.md          # This file
```

## Study modes

- **Flashcards** — Type the answer; hard mode requires three correct retries after a mistake.
- **Quiz** — Multiple-choice questions generated from the same card pool.
- **Smart Review** — Spaced repetition (SM-2 variant), progress stored in `localStorage`.
- **Reading** — Long-form guides for context.
- **Projects** — Step-by-step tutorials (Mail List Manager suite).

## Content covered

| Category | Modules | Cards |
|---|---|---|
| Terminal  | 6  | 39 |
| Git       | 6  | 38 |
| CLASP     | 7  | 59 |
| Firebase  | 4  | 30 |
| Google Cloud | 4 | 36 |

Counts come from `nextjs-app/data/index.json`; that file is the source of truth.

## Adding a new module

1. Drop a JSON file in `nextjs-app/data/` matching the existing module shape.
2. Add an entry under `modules.flashcards` in `nextjs-app/data/index.json`.
3. Register the import in `nextjs-app/lib/data/modules.ts`.

The flashcards and quiz API routes both read from `lib/data/modules.ts`, so step 3 covers both.

## Deployment

The app is configured for Vercel (`nextjs-app/vercel.json`). `npm run build` produces a standard Next.js production build.

## Contributing

PRs welcome. See [`nextjs-app/README.md`](./nextjs-app/README.md) for setup and authoring details.
