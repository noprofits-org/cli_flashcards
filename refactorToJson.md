# Refactor Plan: Move to Static JSON-based GitHub Pages

## Why Refactor?

### Problems with Current Approach
1. **Supabase is overkill** - We're just serving static flashcard data
2. **Database migrations are tedious** - Every content change requires a migration file
3. **Deployment complexity** - Vercel + Supabase adds unnecessary infrastructure
4. **Hard to maintain** - Content changes require SQL knowledge
5. **Incorrect terminology** - Found error: "Create a new deployment version" should be "Create a new deployment"

### Benefits of Static Approach
1. ✅ **Simple editing** - Just edit JSON file directly
2. ✅ **Git-based workflow** - All changes tracked in version control
3. ✅ **Zero infrastructure** - GitHub Pages is free and simple
4. ✅ **No build step** - Pure HTML/CSS/JS
5. ✅ **Faster iteration** - Make changes, commit, done
6. ✅ **Easy to review** - Content changes are visible in diffs

## Migration Steps

### 1. Extract Flashcard Data to JSON
**Source**: `/src/Index.html` (v1 Apps Script version)
- Extract `flashcards` array (29 basic commands)
- Extract `advancedFlashcards` array (27 advanced options)

**Destination**: `/docs/data.json`

**Structure**:
```json
{
  "clasp-basics": [
    {
      "task": "Task description",
      "answer": "clasp command",
      "description": "What it does",
      "whenToUse": "When to use it",
      "scenarios": ["Scenario 1", "Scenario 2", "Scenario 3"]
    }
  ],
  "clasp-advanced": [...]
}
```

### 2. Build Static HTML/CSS/JS App
**Location**: `/docs/index.html`

**Features to port from Next.js version**:
- ✅ Hard mode with 3-retry logic
- ✅ Keyboard shortcuts (Enter, Arrow keys, Esc)
- ✅ Auto-focus and clear input on new cards
- ✅ Mode selector (Basic/Advanced)
- ✅ Context information (description, when to use, scenarios)
- ✅ Dark mode support
- ✅ Progress tracking

**Simplifications**:
- No React/Next.js framework
- No API routes - just fetch JSON
- No database - data in JSON file
- No build process - vanilla JavaScript

### 3. Fix Content Issues
**Terminology fixes**:
- ❌ "Create a new deployment version"
- ✅ "Create a new deployment"
- Update description to remove "versioned"

**Other improvements**:
- Verify all command descriptions are accurate
- Ensure scenarios are realistic and helpful
- Check that "when to use" guidance is clear

### 4. GitHub Pages Setup
**Configuration**:
- Source: `/docs` folder from main branch
- No custom domain needed initially
- Works at: `https://[username].github.io/claspcards/`

**Files needed in `/docs`**:
```
docs/
├── index.html       # Single-page app
├── data.json        # All flashcard data
└── (optional) styles.css, app.js if you want to separate
```

### 5. Deprecate Old Versions
**Keep for reference**:
- `/src/` - Original Apps Script version (v1)
- `/nextjs-app/` - Next.js + Supabase version (v2)

**Add notes**:
- README pointing to new `/docs` version
- Explain why we moved to static

## Implementation Checklist

- [ ] Create `/docs/data.json` with all 56 flashcards
- [ ] Fix "deployment version" → "deployment" terminology
- [ ] Build `/docs/index.html` with all features
- [ ] Implement hard mode in vanilla JS
- [ ] Add keyboard navigation
- [ ] Test locally
- [ ] Configure GitHub Pages
- [ ] Update main README
- [ ] Add deprecation notes to old versions

## Technical Details

### Hard Mode Logic (Vanilla JS)
```javascript
// State management
let state = {
  hardMode: false,
  currentRetryAttempt: 0, // 0, 1, 2, or 3
  // ...
}

// Submit handler
function handleSubmit(userAnswer, correctAnswer) {
  if (hardMode && !isCorrect) {
    // Wrong answer - start retry sequence
    state.currentRetryAttempt = 1;
    showAnswer(); // Show for attempts 1 & 2
  } else if (hardMode && state.currentRetryAttempt > 0) {
    if (state.currentRetryAttempt < 3) {
      // Still retrying
      state.currentRetryAttempt++;
      if (state.currentRetryAttempt === 3) {
        hideAnswer(); // Hide for attempt 3
      }
    } else {
      // Completed 3 retries
      state.currentRetryAttempt = 0;
      moveToNextCard();
    }
  }
}
```

### Data Loading
```javascript
async function loadFlashcards() {
  const response = await fetch('data.json');
  const data = await response.json();
  return data;
}
```

### Benefits Summary
1. **Maintenance**: Edit JSON → commit → done
2. **Hosting**: Free on GitHub Pages
3. **Performance**: No server, just static files
4. **Simplicity**: No build tools, frameworks, or databases
5. **Reliability**: Can't go down (GitHub is very stable)
6. **Version control**: All changes in Git

## Timeline Estimate
- Extract data: 30 minutes
- Build static app: 2-3 hours
- Test and polish: 1 hour
- Deploy and verify: 15 minutes

**Total**: ~4 hours for complete migration

## Success Criteria
- [ ] All 56 flashcards load correctly
- [ ] Hard mode works as designed
- [ ] Keyboard shortcuts functional
- [ ] Works on mobile and desktop
- [ ] Dark mode works
- [ ] Terminology fixed
- [ ] GitHub Pages deployed
- [ ] Documentation updated
