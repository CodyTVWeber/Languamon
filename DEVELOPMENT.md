# 🛠️ Development Guide

Quick reference for developing Linguomon.

## 🚀 Getting Started

### Running the Game
```bash
# Simple: just open index.html in your browser

# Or with a server:
python3 -m http.server 8000
# Then visit: http://localhost:8000
```

### Project Structure
```
/workspace/
├── index.html          ← Game page
├── style.css           ← All styling
├── game.js             ← Game logic
├── README.md           ← Project overview
├── ROADMAP.md          ← Future planning
└── DEVELOPMENT.md      ← This file
```

---

## 📝 Common Tasks

### Automated Testing

- Install dependencies: `npm install`
- Install browser binaries (first run only): `npx playwright install --with-deps`
- Run the end-to-end suite: `npm run test:e2e`
  - Spins up a local static server and opens the game in headless Chromium.
  - Verifies the menu renders, keyboard navigation works, and the HUD updates when entering the overworld.

**Coverage:** current tests cover the primary happy path only. They do not validate encounters, input edge cases, or mobile controls yet. Add more scenarios under `tests/e2e/` as new features ship.

### Adding a New Word

Edit `game.js`, find `initLinguomon()`:

```javascript
this.linguomonDatabase = [
    // Add your new word:
    {
        id: 23,                      // Unique ID
        word: "perro",               // Word in target language
        translation: "dog",          // English translation
        language: "Spanish",         // Language name
        emoji: "🐕",                 // Visual emoji
        difficulty: 1,               // 1 (easy) to 3 (hard)
        type: "animal"               // Type for battle mechanics
    },
    // ... rest of words
];
```

**Word Types**: `greeting`, `animal`, `nature`, `place`, `object`, `social`

### Changing the Map

Edit `initMap()` in `game.js`:

```javascript
this.map = [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,0,0,0,0,1,1,1,0,0,0,0,0,0,3],
    // ... edit tile values
];
```

**Tile Types**:
- `0` = Grass (encounters happen)
- `1` = Path (safe)
- `2` = Water (blocked)
- `3` = Tree (blocked)
- `4` = House (blocked)
- `5` = Flower (decorative)

### Adjusting Difficulty

**Encounter Rate** (in `updatePlayer()`):
```javascript
if (tile === 0 && Math.random() < 0.15) { // Change 0.15 (15% chance)
    this.startBattle();
}
```

**Level Up Speed** (in `gainExperience()`):
```javascript
const newLevel = Math.floor(this.player.experience / 50) + 1; // Change 50
```

**Battle Damage**:
```javascript
// In attackEnemy()
const damage = 40; // Change this

// In useWordInBattle()
const damage = typeMatch ? 50 : 30; // Change these
```

### Changing Colors

Edit `style.css`:

```css
/* Main theme */
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Buttons */
.battle-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Battle background */
.battle-screen {
    background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
}
```

### Adding Sound Effects

1. Add audio files to `sounds/` folder (create it first)
2. In `game.js`, add at top:

```javascript
class Game {
    constructor() {
        // ... existing code
        
        // Add sound system
        this.sounds = {
            catch: new Audio('sounds/catch.mp3'),
            battle: new Audio('sounds/battle.mp3'),
            victory: new Audio('sounds/victory.mp3'),
            levelup: new Audio('sounds/levelup.mp3')
        };
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play();
        }
    }
}
```

3. Use it:
```javascript
this.playSound('catch'); // When catching Linguomon
```

---

## 🐛 Common Issues

### Game Doesn't Load
- **Check browser console** (F12) for errors
- Make sure you're using a local server (not `file://`)
- Verify all three files are in the same folder

### Player Can't Move
- Check if you're in battle mode (should show battle screen)
- Verify keyboard events are registering (console.log in keydown)
- Check collision detection in `canMoveTo()`

### No Encounters
- Make sure you're walking on grass tiles (light green)
- Check encounter rate (might just be unlucky!)
- Verify `Math.random() < 0.15` line exists

### Quiz Not Working
- Check browser console for JavaScript errors
- Verify `linguomonDatabase` has valid data
- Make sure quiz answers are being shuffled

### Caught Words Not Showing
- Check `this.collectedLinguomon` array
- Press 'L' key to open Linguodex
- Verify quiz answer was correct

---

## 🎨 Style Customization

### Making it Your Own

**Change Theme Color**:
```css
/* Replace #667eea with your color throughout style.css */
--primary-color: #667eea;
--secondary-color: #764ba2;
```

**Adjust Game Size**:
```javascript
// In game.js constructor:
this.tileSize = 32;      // Tile size in pixels
this.mapWidth = 15;      // Map width in tiles
this.mapHeight = 13;     // Map height in tiles

// And in index.html:
<canvas id="gameCanvas" width="480" height="432"></canvas>
// width = tileSize * mapWidth
// height = tileSize * mapHeight
```

**Custom Fonts**:
```css
/* In style.css */
body {
    font-family: 'Your Font Here', 'Courier New', monospace;
}
```

---

## 🧪 Testing Checklist

Before considering a feature "done":

- [ ] Test on Chrome
- [ ] Test on Firefox  
- [ ] Test on Safari
- [ ] Test on mobile browser
- [ ] Check all buttons work
- [ ] Verify no console errors
- [ ] Test edge cases (e.g., catching when not weakened)
- [ ] Verify quiz questions make sense
- [ ] Check UI on different screen sizes
- [ ] Test with keyboard and mouse

---

## 📊 Performance Tips

### Optimization

**Canvas Rendering**:
```javascript
// Only redraw when needed
render() {
    if (this.state === 'battle') return; // Don't render world during battle
    // ... rendering code
}
```

**Reduce Memory Usage**:
```javascript
// Don't create new objects every frame
// Bad:
render() {
    const colors = { 0: '#90EE90', ... }; // New object every frame!
}

// Good:
constructor() {
    this.tileColors = { 0: '#90EE90', ... }; // Create once
}
```

**Event Listeners**:
```javascript
// Remove when not needed
document.addEventListener('keydown', this.handleKeyDown);
// Later:
document.removeEventListener('keydown', this.handleKeyDown);
```

---

## 🔧 Debugging Tips

### Console Logging

```javascript
// See what's happening
updatePlayer() {
    console.log('Player position:', this.player.x, this.player.y);
    console.log('Current tile:', this.map[this.player.y][this.player.x]);
}

// Debug battles
startBattle() {
    console.log('Battle started:', this.currentBattle);
}

// Watch state changes
setState(newState) {
    console.log('State change:', this.state, '->', newState);
    this.state = newState;
}
```

### Chrome DevTools

1. Open with `F12`
2. **Console**: See logs and errors
3. **Elements**: Inspect HTML/CSS
4. **Sources**: Set breakpoints in JavaScript
5. **Network**: Check if files are loading

### Common Debug Points

```javascript
// Check if quiz is generated correctly
createQuiz(type) {
    const quiz = this.currentQuiz;
    console.log('Quiz:', quiz.correctAnswer, quiz.answers);
}

// Verify word was added
catchLinguomon() {
    console.log('Collection size:', this.collectedLinguomon.length);
}

// Test collision detection
canMoveTo(x, y) {
    const tile = this.map[y][x];
    console.log('Tile at', x, y, ':', tile);
    return tile !== 2 && tile !== 3 && tile !== 4;
}
```

---

## 📚 Learning Resources

### Vanilla JavaScript
- [JavaScript.info](https://javascript.info/) - Modern JS tutorial
- [MDN Web Docs](https://developer.mozilla.org/) - Reference

### Canvas API
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [Canvas Cheat Sheet](https://simon.html5.org/dump/html5-canvas-cheat-sheet.html)

### Game Development
- [Game Programming Patterns](https://gameprogrammingpatterns.com/) - Free book
- [HTML5 Game Dev](https://developer.mozilla.org/en-US/docs/Games)

### When You're Ready for React
- [React Official Docs](https://react.dev/)
- [React Game Dev](https://www.youtube.com/results?search_query=react+game+development)

### When You're Ready for Phaser
- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 Examples](https://phaser.io/examples)

---

## 🤝 Contributing

### Before Making Changes

1. **Test current version** - Make sure it works
2. **Plan your changes** - Know what you want to do
3. **Make small commits** - Easier to track
4. **Test after changes** - Don't break existing features

### Code Style

```javascript
// Use clear names
✅ this.startBattle()
❌ this.sb()

// Comment complex logic
✅ // Calculate damage with type effectiveness
    const damage = typeMatch ? 50 : 30;
❌ const d = tm ? 50 : 30;

// Keep functions small
✅ One function = one responsibility
❌ Giant 500-line functions

// Use consistent formatting
✅ Same indentation, spacing, etc.
```

### Git Workflow

```bash
# Make changes on a branch
git checkout -b feature/add-sound

# Commit often
git add .
git commit -m "Add sound effects system"

# Test before pushing
# Then push
git push origin feature/add-sound
```

---

## 💡 Ideas to Try

### Quick Wins (< 1 hour)
- Add more words to existing languages
- Change the map layout
- Adjust colors and styling
- Modify encounter rates
- Add new tile types

### Medium Projects (1-3 hours)
- Add a new language
- Create a new map area
- Add simple animations
- Implement sound effects
- Add localStorage saves

### Big Projects (3+ hours)
- Add NPC trainers
- Create a story mode
- Implement sentence building
- Add multiplayer battles
- Migrate to React

---

## 🎯 Your Next Steps

1. **Play the game** - Understand what you built
2. **Change something small** - Build confidence
3. **Add a feature you want** - Make it yours
4. **Get feedback** - Show friends/family
5. **Iterate** - Improve based on feedback

Remember: Every game starts as a prototype! 🚀

---

**Questions?** Check the main README.md or ROADMAP.md for more info.
