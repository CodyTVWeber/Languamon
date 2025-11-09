# 🎮 HOW TO PLAY LINGUOMON

## Quick Start

### Option 1: Simple (No Server)
1. Open `index.html` directly in your browser
2. Start playing!

### Option 2: With Server (Recommended)
```bash
# Run the start script:
./start-server.sh

# Or manually:
python3 -m http.server 8000
```
Then visit: http://localhost:8000

---

## 🎯 Game Objective

**Catch words in different languages to build your vocabulary!**

- Explore the world
- Find wild Linguomon (word monsters)
- Answer quiz questions to catch them
- Build your collection (Linguodex)
- Level up to encounter harder words

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| **↑ ↓ ← →** | Move player |
| **W A S D** | Alternative movement |
| **L** | Open Linguodex (your collection) |
| **Mouse** | Click buttons in battles |

---

## 🌍 Exploring the World

### Map Tiles
- 🟢 **Light Green (Grass)** - Wild Linguomon appear here!
- 🟤 **Tan (Path)** - Safe zone, no encounters
- 🔵 **Blue (Water)** - Can't walk here
- 🌲 **Dark Green (Trees)** - Blocked
- 🏠 **Brown (Houses)** - Blocked
- 🌸 **Pink (Flowers)** - Decorative grass

**Tip**: Walk through grass to trigger random encounters!

---

## ⚔️ Battle System

When a wild Linguomon appears, you have 4 options:

### 1. 🥊 FIGHT
- Answer a quiz question about the word
- Get it right = Deal 40 damage to the enemy
- Get it wrong = Linguomon escapes!
- **Use this to weaken strong Linguomon**

### 2. 🎯 CATCH
- Try to catch the Linguomon
- Must answer a quiz question correctly
- ⚠️ **Only works if enemy is weakened first!**
- Successful catch adds word to your collection

### 3. 🏃 RUN
- Escape the battle safely
- No penalty, but you don't catch anything

### 4. 📚 USE WORD
- Attack using a Linguomon you've already caught
- Different word types deal different damage
- Type match = 50 damage (super effective!)
- No match = 30 damage
- **Great for weakening tough enemies**

---

## 📝 Quiz System

Questions test you in **two directions**:

### Foreign → English
**"What does 'gato' mean?"**
- A) cat ✅
- B) dog
- C) house
- D) water

### English → Foreign
**"How do you say 'hello' in Spanish?"**
- A) agua
- B) hola ✅
- C) casa
- D) libro

**Tip**: Take your time! Wrong answer = enemy escapes!

---

## ⚡ Type System

Words have types that affect battle damage:

| Type | Examples |
|------|----------|
| 🤝 greeting | hello, thank you |
| 🐱 animal | cat, dog |
| 🌊 nature | water, sun, moon |
| 🏠 place | house, school |
| 📚 object | book, pen |
| 👥 social | friend, family |

**Type Match Bonus**: Using a word of the same type as your enemy deals **50 damage** instead of 30!

---

## 📚 Linguodex

Press **L** key anytime to view your collection!

Shows:
- All Linguomon you've caught
- Word + translation
- Language and difficulty level
- Type classification
- How many times you've caught it

**Goal**: Catch all 22 words! 🎯

---

## 🆙 Leveling System

### Gain Experience (XP) by:
- **Catching** a Linguomon: +20 XP
- **Defeating** a Linguomon: +10 XP

### Level Up:
- Every **50 XP** = 1 level up
- Higher level = Encounter harder words
- Max difficulty depends on your level

---

## 🎓 Languages Available

| Language | Words | Difficulty |
|----------|-------|------------|
| 🇪🇸 Spanish | 8 words | ⭐ Easy |
| 🇫🇷 French | 5 words | ⭐⭐ Medium |
| 🇩🇪 German | 5 words | ⭐⭐ Medium |
| 🇯🇵 Japanese | 4 words | ⭐⭐⭐ Hard |

**Total**: 22 words to catch!

---

## 💡 Pro Tips

### For Beginners
1. **Walk through grass** to find Linguomon
2. **Fight first** to weaken enemies before catching
3. **Use type matching** for bonus damage
4. **Review your Linguodex** (press L) to remember words
5. **Take your time** on quiz questions

### Advanced Strategies
1. **Build a balanced collection** - Catch different types
2. **Focus on type coverage** - Have words of each type
3. **Use easier words** to weaken difficult ones
4. **Level up strategically** - Fight instead of running
5. **Learn patterns** - Same word appears multiple times

### Catching Strategy
```
1. Encounter a Linguomon
2. Choose FIGHT → Answer correctly (40 damage)
3. Choose USE WORD → Use type-matched word (50 damage)
4. Enemy is now weakened (< 50 HP)
5. Choose CATCH → Answer correctly → Success! 🎉
```

---

## 🎯 Challenges

### Beginner Goals
- [ ] Catch your first Linguomon
- [ ] Reach level 2
- [ ] Collect 5 different words
- [ ] Catch a word from each language

### Intermediate Goals
- [ ] Catch all Spanish words (8 total)
- [ ] Reach level 5
- [ ] Collect all word types
- [ ] Win 10 battles using USE WORD

### Expert Goals
- [ ] Catch all 22 Linguomon
- [ ] Reach max level
- [ ] Catch 3 of each word
- [ ] Never run from a battle

---

## ❓ FAQ

**Q: How do I save my progress?**  
A: Currently no save system - progress resets on page refresh. Coming in future update!

**Q: Why can't I catch the Linguomon?**  
A: You must weaken it first by reducing its HP below 50. Use FIGHT or USE WORD actions.

**Q: What happens if I get the quiz wrong?**  
A: The Linguomon escapes and you exit the battle without catching it.

**Q: Can I catch the same word multiple times?**  
A: Yes! Each catch counts and is tracked in your Linguodex.

**Q: How do I know which type a word is?**  
A: Check your Linguodex (press L) to see type information for caught words.

**Q: What's the best strategy for learning?**  
A: Catch the same word multiple times to reinforce memory through spaced repetition.

**Q: Can I battle other players?**  
A: Not yet - single player only. Multiplayer is on the roadmap!

**Q: Why can't I move through water/trees?**  
A: These tiles are blocked for navigation. Stay on grass and paths.

**Q: What's the encounter rate in grass?**  
A: 15% chance per step in grass tiles.

**Q: How do I add more words?**  
A: Check DEVELOPMENT.md for instructions on editing the word database.

---

## 🎊 Have Fun!

Remember: **The goal is learning, not just winning!**

Every encounter is a chance to practice. Even if you get answers wrong, you're learning. Review your Linguodex frequently and try to recall the meanings before checking.

**Happy language learning! 🌍🎮📚**

---

Need help? Check the README.md for more documentation.
