# Clasp Flashcards - Static Version

A lightweight, single-page flashcard application for mastering Google Apps Script CLI (`clasp`) commands. This version runs entirely in the browser with no build step or backend required.

## Features

### Core Functionality
- **56 Total Flashcards**: 29 basic commands + 27 advanced options
- **Two Difficulty Levels**: Basic and Advanced modes
- **Hard Mode**: Wrong answers require 3 correct retries before moving on
- **Progress Tracking**: Visual progress bar and score tracking
- **Context-Rich Learning**: Each card includes:
  - Task description
  - Command answer
  - What it does
  - When to use it
  - 3 real-world scenarios

### User Experience
- **Keyboard Shortcuts**:
  - `Enter`: Submit answer / Continue to next card
  - `←` / `→`: Navigate between cards
  - `Esc`: Return to mode selection
- **Auto-focus**: Input field automatically focused on each new card
- **Auto-clear**: Input cleared when moving to next card
- **Dark Mode**: Automatic support via CSS `prefers-color-scheme`
- **Mobile Responsive**: Works great on phones, tablets, and desktops

### Hard Mode Logic (As Specified)
When enabled, hard mode implements a 3-retry sequence for wrong answers:
1. **Wrong Answer**: Show the correct answer, prompt to retry (Attempt 1/3)
2. **Retry 1 & 2**: Answer remains visible, user must type it correctly
3. **Retry 3**: Answer is hidden, user must type from memory
4. **After 3 Retries**: Move to next card (regardless of final result)

## Files

```
docs/
├── index.html    # Complete single-page application (HTML + CSS + JS)
├── data.json     # All flashcard data (56 cards)
└── README.md     # This file
```

## Usage

### Local Development
```bash
# Serve locally with Python
cd docs
python3 -m http.server 8080

# Or with Node.js
npx http-server -p 8080

# Then open: http://localhost:8080
```

### GitHub Pages
1. Push to your GitHub repository
2. Go to Settings → Pages
3. Set source to "main branch /docs folder"
4. Access at: `https://[username].github.io/[repo-name]/`

### Direct File Access
Simply open `index.html` in a web browser. The app will work offline!

## Data Structure

The `data.json` file contains two sets of flashcards:

```json
{
  "clasp-basics": [
    {
      "task": "Authenticate with your Google Account",
      "answer": "clasp login [options]",
      "description": "Authorizes clasp to manage...",
      "whenToUse": "Required before using any other...",
      "scenarios": [
        "First-time setup: After installing...",
        "Switching accounts: Use --creds flag...",
        "CI/CD setup: Use --no-localhost flag..."
      ]
    }
  ],
  "clasp-advanced": [...]
}
```

## Technology Stack

- **Pure HTML/CSS/JavaScript**: No frameworks or build tools
- **CSS Variables**: For theming and dark mode support
- **Fetch API**: For loading flashcard data
- **LocalStorage Ready**: Can be extended to save progress
- **Mobile-First**: Responsive design for all screen sizes

## Answer Validation

Answers are checked with:
- Case-insensitive comparison
- Whitespace normalization
- Exact match required (encourages precision)

## Browser Support

Works in all modern browsers that support:
- CSS Variables
- Fetch API
- ES6 JavaScript
- CSS Grid/Flexbox

## Customization

### Adding New Flashcard Sets
Edit `data.json` and add a new key:

```json
{
  "clasp-basics": [...],
  "clasp-advanced": [...],
  "new-set": [
    {
      "task": "...",
      "answer": "...",
      "description": "...",
      "whenToUse": "...",
      "scenarios": ["...", "...", "..."]
    }
  ]
}
```

The app will automatically detect and display the new set.

### Styling
All styles are in the `<style>` section of `index.html`. Modify CSS variables in `:root` and `@media (prefers-color-scheme: dark)` for custom theming.

### Hard Mode Behavior
The hard mode retry logic is in the `handleSubmit()` method around lines 700-750 in `index.html`.

## Advantages Over Database Version

1. **Zero Infrastructure**: No Vercel, Supabase, or build tools needed
2. **Instant Edits**: Modify `data.json` and refresh
3. **Version Control**: All changes tracked in Git
4. **Free Hosting**: GitHub Pages with no limits
5. **Offline Capable**: Works without internet after first load
6. **Simple Deployment**: Just push to GitHub
7. **Easy Backups**: Just files in Git
8. **No Migrations**: Edit JSON directly instead of SQL

## Performance

- **Initial Load**: ~75KB (index.html + data.json)
- **No API Calls**: Everything loads once
- **Fast Rendering**: Vanilla JS DOM manipulation
- **Instant Navigation**: No page reloads

## Future Enhancements (Optional)

- LocalStorage for saving session progress
- Export results as CSV
- Spaced repetition algorithm
- Custom flashcard sets via file upload
- Print-friendly stylesheet
- PWA manifest for "install to home screen"

## License

Same as parent repository.

## Credits

Built as a static alternative to the Next.js + Supabase version, following the refactoring plan in `refactorToJson.md`.
