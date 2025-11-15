# Master CLI Commands - Interactive Flashcards

A static web app for learning essential command-line tools through interactive flashcards. Hosted on GitHub Pages for easy access and maintenance.

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
├── docs/                 # GitHub Pages root
│   ├── index.html       # Main app (static HTML/CSS/JS)
│   ├── data.json        # Flashcard data
│   └── styles.css       # Styles (if separated)
├── src/                 # Legacy Apps Script version
├── nextjs-app/          # Legacy Next.js version (being phased out)
└── README.md
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

1. **Enable GitHub Pages** in repository settings
2. **Set source** to `/docs` folder from main branch
3. **Push changes** to main branch
4. **Access** at `https://[username].github.io/[repo]/`

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

## Migration Notes

This project was migrated from:
1. **v1**: Apps Script hosted web app
2. **v2**: Next.js + Supabase (overly complex)
3. **v3**: Static site on GitHub Pages (current - simple & maintainable)

See `refactorToJson.md` for migration details.

## Contributing

1. Edit `docs/data.json` to fix or add flashcards
2. Test locally by opening `docs/index.html`
3. Submit a pull request

## License

Free to use and modify. Share with other developers!

---

**Happy Learning! Master CLI commands one card at a time.** 📚
