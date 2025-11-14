# Clasp Commands Flashcard Web App

A mobile-first Google Apps Script web app for learning clasp commands through interactive flashcards.

## Features

- **29 Interactive Flashcards** - Master all major clasp commands
- **Mobile-First Design** - Optimized for phones and tablets with swipe navigation
- **Dark Mode Support** - Auto-detects system preference
- **Real-Time Score Tracking** - See your progress throughout each session
- **Randomized Decks** - Cards shuffle every session for better learning
- **Touch-Optimized UI** - Large buttons and inputs for easy mobile interaction
- **Swipe Navigation** - Swipe left/right to navigate between cards
- **Instant Feedback** - Immediate answer checking with visual feedback

## Flashcard Topics

All 29 clasp commands including:
- Authentication (login, logout)
- Project Management (create, clone, delete)
- Deployment (push, pull, deploy, undeploy)
- API Management (enable-api, disable-api, list-apis)
- Logging (open-logs, tail-logs)
- Version Control (create-version, list-versions)
- Script Management (open-script, open-container, run-function)
- And more!

## Setup & Deployment

### Prerequisites

- Google Account
- Node.js and npm installed
- Clasp CLI installed globally

```bash
npm install -g @google/clasp
```

### Installation Steps

1. **Clone this project**
```bash
git clone <repository-url>
cd claspcards
```

2. **Create a new Google Apps Script project**

   Option A: If starting fresh
   ```bash
   clasp create --type webapp --title "Clasp Flashcards"
   ```

   Option B: If updating existing project
   - Update the `scriptId` in `.clasp.json` with your existing script ID

3. **Authenticate with Google**
```bash
clasp login
```

4. **Deploy the web app**
```bash
clasp push
clasp deploy
```

5. **Access the app**
   - The deployment will provide a URL to your web app
   - Open it in your browser (works best on mobile!)

### Configuration

Edit `.clasp.json` to specify your script ID:
```json
{
  "scriptId": "YOUR_SCRIPT_ID",
  "rootDir": "."
}
```

## File Structure

```
claspcards/
├── Code.gs              # Backend Google Apps Script
├── Index.html           # Main app with inline CSS/JS
├── appsscript.json      # GAS project configuration
├── .clasp.json          # Clasp CLI configuration
├── .claspignore         # Files to exclude from push
└── README.md            # This file
```

## Usage

1. **Start Learning** - Click the start button on the welcome screen
2. **Read the Task** - Each card shows a task description
3. **Type Your Answer** - Enter the clasp command (or alias) you think is correct
4. **Submit** - Click "Submit Answer" or press Enter
5. **Review** - See the correct answer and if you got it right
6. **Navigate** - Swipe left/right or use Previous/Next buttons
7. **Track Progress** - Watch your score and progress bar update
8. **Finish** - Complete all cards to see your final score

## Keyboard Shortcuts

- **Enter** - Submit answer (when focused on input field)
- **Arrow Keys** - Navigate between cards (on desktop)
- **Swipe** - Navigate between cards (on mobile)

## Customization

### Adding More Commands

Edit the `flashcards` array in `Index.html`:

```javascript
const flashcards = [
  { 
    task: "Your task description", 
    answer: "clasp command" 
  },
  // Add more cards...
];
```

### Styling

Modify CSS variables in the `<style>` section:

```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-error: #ef4444;
  /* ... more variables ... */
}
```

### Dark Mode

The app automatically detects system preference:
- Light mode variables override dark mode in `@media (prefers-color-scheme: dark)`
- Users' system settings control the appearance

## Troubleshooting

### "Script not found" error
- Ensure `.clasp.json` has the correct `scriptId`
- Run `clasp pull` to sync with the cloud

### App not loading
- Check that `appsscript.json` has `"access": "ANYONE"`
- Verify the deployment is active in Apps Script editor

### Touch gestures not working
- Ensure you're on a touch-enabled device
- Try using the Previous/Next buttons as fallback

### Dark mode not working
- Check your system color scheme preference
- Try the alternative in your browser settings

## Browser Compatibility

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Performance

The app loads in under 2 seconds and works offline once cached. All 29 flashcards are pre-loaded for instant navigation.

## License

Free to use and modify. Share with other developers learning clasp!

## Contributing

Have suggestions or found issues? Let me know!

---

**Happy Learning! Master clasp commands one card at a time.** 📚
