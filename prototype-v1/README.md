# Linguomon - Prototype v1 (Vanilla JS)

## 🎯 What is this?

This is the **proof of concept** version of Linguomon built with pure vanilla JavaScript, HTML5 Canvas, and CSS. No frameworks, no build tools - just simple web technologies.

## 🚀 How to Run

### Option 1: Direct File Open
Simply open `index.html` in your web browser.

### Option 2: Local Server (Recommended)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have npx)
npx serve

# PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 📂 File Structure

```
prototype-v1/
├── index.html      # Game structure and UI elements
├── style.css       # All styling and animations
└── game.js         # Complete game logic (~600 lines)
```

## 🎮 How to Play

1. **Move Around**: Use Arrow Keys or WASD
2. **Find Linguomon**: Walk through the light green grass tiles
3. **Battle**: When a wild Linguomon appears, choose your action:
   - **FIGHT**: Damage the monster by answering quiz questions
   - **CATCH**: Try to catch it (must weaken it first!)
   - **USE WORD**: Battle using your collected words
   - **RUN**: Escape the battle
4. **Answer Quizzes**: Get the translation right to succeed!
5. **Collect**: Build your Linguodex by catching different words
6. **Level Up**: Gain experience to unlock harder words

## 🧠 Code Architecture

### Game Class Structure
```javascript
class Game {
  constructor()          // Initialize game
  
  // Map & Rendering
  initMap()             // Create tile-based world
  render()              // Draw everything to canvas
  drawTile()            // Render individual tiles
  drawPlayer()          // Render player character
  
  // Player & Movement
  updatePlayer()        // Handle keyboard input
  canMoveTo()           // Collision detection
  
  // Battle System
  startBattle()         // Initialize encounter
  showBattleScreen()    // Display battle UI
  handleFight()         // Fight action
  handleCatch()         // Catch action
  useWordInBattle()     // Use collected word
  
  // Quiz System
  createQuiz()          // Generate quiz questions
  displayQuiz()         // Show quiz UI
  checkAnswer()         // Validate player answer
  
  // Progression
  catchLinguomon()      // Add to collection
  gainExperience()      // Level up system
  
  // Collection
  openLinguodex()       // View caught words
}
```

### Data Structures

**Player Object:**
```javascript
{
  x: 7,              // Grid position
  y: 10,
  level: 1,          // Player level
  experience: 0      // Total XP
}
```

**Linguomon Object:**
```javascript
{
  id: 1,
  word: "hola",           // Word in target language
  translation: "hello",   // English meaning
  language: "Spanish",    // Source language
  emoji: "👋",            // Visual representation
  difficulty: 1,          // 1-3, affects encounter rate
  type: "greeting"        // For battle mechanics
}
```

**Battle State:**
```javascript
{
  enemy: {...},      // Current enemy Linguomon
  playerHP: 100,     // Player health
  enemyHP: 100,      // Enemy health
  weakened: false    // Can be caught?
}
```

## 🎨 Tile Map System

The world is a 15x13 grid with different tile types:

```javascript
0 = Grass (encounters happen here)
1 = Path (safe zone)
2 = Water (blocked)
3 = Tree (blocked)
4 = House (blocked)
5 = Flower (decorative grass)
```

## 🧪 Game Mechanics

### Encounter Rate
- 15% chance per step in grass
- Linguomon chosen based on player level
- Only shows words up to level + 1 difficulty

### Battle Damage
- Quiz fight: 40 damage
- Word attack: 30 damage (50 if type matches)
- Must reduce enemy HP to 0 or below 50 to weaken

### Quiz Generation
- Randomly chooses translation direction
- 1 correct answer + 3 wrong answers
- Wrong answers shuffled in
- Must answer correctly to succeed

### Experience System
- Catching: +20 XP
- Defeating: +10 XP
- Level up every 50 XP
- Higher levels unlock more difficult words

### Type Effectiveness
Words have types: `greeting`, `animal`, `nature`, `place`, `object`, `social`
- Same type attack = 50 damage (super effective!)
- Different type = 30 damage

## 📚 Current Word Database

**22 words across 4 languages:**
- Spanish (8 words): hola, gato, casa, agua, libro, amigo, sol, luna
- French (5 words): bonjour, chat, maison, eau, merci
- German (5 words): hallo, katze, haus, wasser, buch
- Japanese (4 words): こんにちは, ねこ, みず, ほん

## 🔧 How to Extend

### Adding New Words
Edit `game.js` → `initLinguomon()` → `linguomonDatabase` array:
```javascript
{
  id: 23,
  word: "perro",
  translation: "dog",
  language: "Spanish",
  emoji: "🐕",
  difficulty: 1,
  type: "animal"
}
```

### Adding New Tile Types
1. Add tile ID in `initMap()`
2. Add rendering in `drawTile()`
3. Add collision in `canMoveTo()`

### Changing Encounter Rate
Edit `updatePlayer()` → change `Math.random() < 0.15` to different value

### Adjusting Difficulty
- Change XP requirements in `gainExperience()`
- Adjust damage values in battle methods
- Modify encounter filtering in `startBattle()`

## 🐛 Known Limitations

- No save/load system (progress lost on refresh)
- Limited animations
- No sound effects
- Simple graphics
- Single player only
- No backend/persistence
- All data in memory

## ✨ What Works Well

✅ Core game loop is solid
✅ Battle system is functional
✅ Quiz system works great
✅ Tile-based movement feels good
✅ Type system adds strategy
✅ Clean separation of concerns
✅ Easy to understand and modify

## 🚀 When to Upgrade?

Consider moving to a framework when:
- Adding 100+ words (need better data management)
- Want complex animations (consider Phaser)
- Need save systems (need backend)
- UI gets too complex (consider React)
- Want multiplayer (need websockets)
- Ready to deploy as real app

## 💡 Learning Takeaways

This prototype demonstrates:
- Game loop architecture
- Canvas rendering basics
- State management without frameworks
- Event-driven programming
- Collision detection
- Turn-based battle systems
- Quiz/educational game mechanics

Perfect foundation for scaling up! 🎓
