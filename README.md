# 🎮 LINGUOMON
### Language Learning Pokemon Clone

Catch words, learn languages, and become a Linguomon master!

## 📁 Project Structure

```
/workspace
├── index.html             # Main game page
├── style.css              # Game styling
├── game.js                # Core game logic
├── README.md              # This file
├── DEVELOPMENT.md         # Developer guide
├── ROADMAP.md             # Future plans
└── START_HERE.md          # Getting started guide
```

## 🚀 Quick Start

### Running the Game
```bash
# Open index.html in your browser or use a local server:
python3 -m http.server 8000
# Then visit: http://localhost:8000
```

## 🎯 Game Concept

Linguomon is a Pokemon-style language learning game where:
- You explore a tile-based world
- Wild "Linguomon" (word monsters) appear in grass
- You must answer language quiz questions to catch them
- Caught words can be used in battles
- Build your vocabulary by catching more Linguomon!

## 🎮 Controls

- **Arrow Keys / WASD** - Move player
- **L Key** - Open Linguodex (collection)
- **Mouse/Click** - Battle interactions

## 🌟 Current Features

✅ Tile-based overworld with player movement
✅ Random encounters in grass tiles  
✅ Turn-based battle system
✅ Quiz/test system for catching words
✅ Multiple languages (Spanish, French, German, Japanese)
✅ Linguodex collection tracker
✅ Level system and experience
✅ Battle with collected words
✅ Type effectiveness system

## 🛠️ Tech Stack

### Current
- **Vanilla JavaScript** - Core game logic
- **HTML5 Canvas** - Graphics rendering
- **CSS3** - UI styling

### Future Options (see ROADMAP.md)
- **React** - Better UI/state management
- **Phaser.js** - Professional game framework
- **Backend API** - User progress, multiplayer, more words

## 📚 Game Mechanics

### Catching Linguomon
1. Walk through grass to trigger encounters
2. Choose to FIGHT or CATCH
3. Answer quiz questions correctly
4. Weaken monsters by fighting first (makes catching easier)
5. Caught words go into your Linguodex

### Battle System
- **FIGHT** - Answer quiz to deal damage
- **CATCH** - Answer quiz to catch (must weaken first)
- **USE WORD** - Use collected words as attacks
- **RUN** - Escape the battle

### Type System
Words have types (greeting, animal, nature, etc.)
Matching types deal extra damage in battle!

## 🎓 Learning Features

- Translation quizzes (both directions)
- Spaced repetition through battles
- Visual association with emojis
- Progressive difficulty based on level
- Multiple languages to learn

## 🔮 Future Roadmap

### Phase 2 - Enhanced Features
- [ ] More languages and words
- [ ] Better graphics and animations
- [ ] Sound effects and music
- [ ] More complex battle moves
- [ ] Sentence building mechanics
- [ ] Trainer NPCs to battle
- [ ] Multiple areas/towns

### Phase 3 - Technical Upgrade
- [ ] Migrate to React for better UI
- [ ] Add state management (Redux/Zustand)
- [ ] Backend for progress saving
- [ ] User accounts

### Phase 4 - Advanced Features
- [ ] Multiplayer battles
- [ ] Custom word sets
- [ ] Achievement system
- [ ] Daily challenges
- [ ] Trading system

## 🤝 Contributing

This is a learning project! Feel free to:
- Suggest new features
- Add more languages
- Improve game mechanics
- Refactor code

## 📝 Notes

**Why start with Vanilla JS?**
- Fast prototyping
- No build tools needed
- Easy to understand
- Can refactor to framework later

**When to upgrade?**
- Logic becomes too complex
- Need better state management
- Want advanced animations
- Ready for production

---

**Built with ❤️ for language learners**
