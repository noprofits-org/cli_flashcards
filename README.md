# Master CLI Commands - Interactive Flashcards

A static web app for learning essential command-line tools through interactive flashcards. Hosted on GitHub Pages for easy access and maintenance.

> **Current Version**: v3 - Static HTML/CSS/JS hosted on GitHub Pages
> **Location**: `/docs/` directory
> **Previous versions** (deprecated): v1 Apps Script (`/src/`), v2 Next.js + Supabase (`/nextjs-app/`)

## Features

- **56 Interactive Flashcards** - Master clasp commands (basic + advanced)
- **Hard Mode** - Wrong answers require 3 correct retries before proceeding
- **Keyboard Navigation** - Arrow keys, Enter, and Escape shortcuts
- **Dark Mode Support** - Auto-detects system preference
- **Real-Time Score Tracking** - See your progress throughout each session
- **Randomized Decks** - Cards shuffle every session for better learning
- **Context-Rich Learning** - Each card shows what it does, when to use it, and real-world scenarios
- **Zero Dependencies** - Pure HTML/CSS/JavaScript, no build tools required

## CLI Tools Covered

### Clasp (Google Apps Script CLI)
- **Basic Commands** (29 cards) - Authentication, project management, deployment, API management, logging, version control
- **Advanced Options** (27 cards) - Command flags, CI/CD integration, multi-environment workflows

### Coming Soon
- Git
- Vercel
- Supabase
- Linux
- FreeBSD

## Architecture

This is a **pure static web application** with no backend, no database, and no build process:

- **Frontend**: Single HTML file with embedded CSS and JavaScript
- **Data Storage**: JSON file (`data.json`) containing all flashcard content
- **Hosting**: GitHub Pages (free, reliable, fast CDN)
- **Deployment**: Git push to main branch automatically updates the live site

### Why Static?

We migrated from Next.js + Supabase to a static architecture because:

1. **Simplicity** - No server, no database, no API routes to maintain
2. **Easy Content Updates** - Edit JSON file directly, no SQL migrations needed
3. **Zero Cost** - GitHub Pages is free and reliable
4. **No Build Step** - Pure HTML/CSS/JS means instant changes
5. **Version Control** - All content changes tracked in Git with full history
6. **Performance** - Static files served from GitHub's global CDN
7. **Reliability** - Can't go down, no moving parts to break

For a flashcard app with static content, a database was overkill. This approach is faster to develop, easier to maintain, and simpler to contribute to.

## Quick Start

### View Live
Visit: `https://[your-username].github.io/claspcards/`

### Local Development
```bash
# Clone the repository
git clone https://github.com/[your-org]/claspcards.git
cd claspcards

# Open in browser
open docs/index.html
```

## File Structure

```
claspcards/
├── docs/                 # ✅ Current version (v3) - GitHub Pages root
│   ├── index.html       # Main app (static HTML/CSS/JS)
│   ├── data.json        # Flashcard data
│   └── styles.css       # Styles (if separated)
├── src/                 # ⚠️ Deprecated v1 (Apps Script) - see src/README.md
├── nextjs-app/          # ⚠️ Deprecated v2 (Next.js + Supabase) - see nextjs-app/README.md
├── refactorToJson.md    # Migration rationale and plan
└── README.md            # This file
```

## Usage

1. **Select Mode** - Choose between Basic and Advanced commands
2. **Enable Hard Mode** (optional) - Wrong answers require 3 retries
3. **Read the Task** - Each card shows what the command does and when to use it
4. **Type Your Answer** - Enter the command you think is correct
5. **Submit** - Press Enter to check your answer
6. **Learn** - See the correct answer and real-world scenarios
7. **Navigate** - Use arrow keys or click to move between cards
8. **Track Progress** - Watch your score and progress bar update

## Keyboard Shortcuts

- **Enter** - Submit answer / Continue to next card
- **←/→** - Navigate between cards
- **Esc** - Return to home page

## Hard Mode

When enabled, wrong answers trigger a learning sequence:
1. **Attempt 1 & 2**: Type the correct answer while viewing it (muscle memory)
2. **Attempt 3**: Type from memory (answer hidden)
3. **Wrong on any attempt**: Restart sequence

This reinforcement ensures true mastery of commands you struggle with.

## Editing Flashcards

All flashcard data is stored in `/docs/data.json`:

```json
{
  "clasp-basics": [
    {
      "task": "Authenticate with your Google Account",
      "answer": "clasp login [options]",
      "description": "Authorizes clasp to manage your Google account's Apps Script projects...",
      "whenToUse": "Required before using any other clasp commands...",
      "scenarios": ["First-time setup: ...", "Switching accounts: ...", "CI/CD setup: ..."]
    }
  ]
}
```

Simply edit the JSON file and refresh the page. No build step needed!

## Deployment to GitHub Pages

### Initial Setup

1. **Go to Repository Settings**
   - Navigate to your repository on GitHub
   - Click "Settings" tab

2. **Enable GitHub Pages**
   - Scroll to "Pages" section in sidebar
   - Under "Build and deployment":
     - Source: Deploy from a branch
     - Branch: `main` (or your default branch)
     - Folder: `/docs`
   - Click "Save"

3. **Wait for Deployment**
   - GitHub will build and deploy automatically
   - Check "Actions" tab to see deployment status
   - Usually takes 1-2 minutes

4. **Access Your Site**
   - Visit `https://[username].github.io/[repo]/`
   - Bookmark it for easy access

### Updating Content

Making changes is simple:

```bash
# 1. Edit the flashcard data
vim docs/data.json

# 2. Commit and push
git add docs/data.json
git commit -m "Add new flashcards for Git commands"
git push origin main

# 3. GitHub Pages auto-deploys (1-2 minutes)
```

No build process, no deployment configuration, no CI/CD setup needed. Just edit, commit, push.

## Customization

### Adding New CLI Tools

1. Add new set to `data.json`:
```json
{
  "git-basics": [
    {
      "task": "...",
      "answer": "...",
      "description": "...",
      "whenToUse": "...",
      "scenarios": []
    }
  ]
}
```

2. Cards will automatically appear in the UI grouped by tool

### Styling

Modify CSS variables in `index.html`:

```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-error: #ef4444;
}
```

## Browser Compatibility

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Version History & Migration

This project has evolved through three versions, each learning from the previous:

### v3: Static HTML/CSS/JS on GitHub Pages (Current)
**Location**: `/docs/`
**Status**: Active and recommended

- Pure static site with no dependencies
- JSON-based data storage
- Zero infrastructure costs
- Instant updates via Git

### v2: Next.js + Supabase (Deprecated)
**Location**: `/nextjs-app/`
**Status**: Deprecated - kept for reference only

**Why deprecated?**
- Database was overkill for static flashcard content
- Required Supabase account and Vercel deployment
- SQL migrations needed for simple content updates
- Over-engineered for the use case
- Maintenance overhead not justified by features

**See**: `/nextjs-app/README.md` for setup if you want to explore this version

### v1: Google Apps Script (Deprecated)
**Location**: `/src/`
**Status**: Deprecated - original version

- Hosted as Google Apps Script web app
- All logic embedded in single HTML file
- Required Google account for hosting
- Limited customization options

**See**: `/src/README.md` for historical context

### Migration Details

For detailed migration rationale and technical decisions, see:
- `refactorToJson.md` - Migration plan from v2 to v3
- Commit history for implementation details

## Contributing

1. Edit `docs/data.json` to fix or add flashcards
2. Test locally by opening `docs/index.html`
3. Submit a pull request

## License

Free to use and modify. Share with other developers!

---

**Happy Learning! Master CLI commands one card at a time.** 📚
