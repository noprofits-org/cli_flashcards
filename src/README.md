# CLI Flashcards - Google Apps Script Version

> **⚠️ DEPRECATED - Version 1 (Original)**
>
> This is the **original version** of the CLI Flashcards app, built with Google Apps Script.
>
> **Use instead**: `/docs/` directory (v3 - Static HTML/CSS/JS)
>
> **Why deprecated?**
> - Required Google account for hosting
> - Tied to Google Apps Script platform
> - Limited customization and deployment options
> - All code embedded in single HTML file
> - Harder to version control and collaborate
>
> This version is kept for historical reference and to show the project's evolution.
>
> See the main [README.md](../README.md) for the current recommended version.

---

## Original Version (v1)

### Files

- `Code.js` - Server-side Apps Script code (minimal)
- `Index.html` - Main application with embedded HTML, CSS, and JavaScript
- `appsscript.json` - Apps Script configuration file
- `.clasp.json` - Clasp CLI configuration for deployment

### Features

The original version included:
- 29 basic flashcards for clasp commands
- 27 advanced flashcards for command flags
- Interactive quiz interface
- Hard mode with retry logic
- Keyboard shortcuts
- Dark mode support

All functionality was contained in a single `Index.html` file served by Google Apps Script.

### Deployment (Historical)

This version was deployed using:

```bash
# Install clasp CLI
npm install -g @google/clasp

# Login to Google
clasp login

# Push to Apps Script
clasp push

# Deploy as web app
clasp deploy
```

The app was then accessible via a Google Apps Script web app URL.

### Evolution

This version evolved into:
1. **v2**: Next.js + Supabase (added database, modern framework)
2. **v3**: Static HTML/CSS/JS (simplified back to static, removed unnecessary complexity)

The v3 static version combines the simplicity of v1 with the improved UX of v2, while eliminating platform dependencies.

---

**Note**: If you want to explore Google Apps Script development or see how the app started, feel free to examine the code. The core logic and UX patterns were carried forward to later versions.
