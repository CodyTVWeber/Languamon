// ============================================
// LINGUOMON - Language Learning Game
// ============================================

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 32;
        this.mapWidth = 15;
        this.mapHeight = 13;
        
        this.state = 'world'; // 'world' or 'battle'
        this.player = {
            x: 7,
            y: 10,
            level: 1,
            experience: 0
        };
        
        this.collectedLinguomon = [];
        this.seenLinguomon = new Set();
        
        this.keys = {};
        this.lastMoveTime = 0;
        this.moveDelay = 150;
        
        this.battleScreen = document.getElementById('battleScreen');
        this.battleMessage = document.getElementById('battleMessage');
        this.battleMenu = document.getElementById('battleMenu');
        this.quizSection = document.getElementById('quizSection');
        this.wordSelection = document.getElementById('wordSelection');
        
        this.currentBattle = null;
        this.currentQuiz = null;
        
        this.initMap();
        this.initLinguomon();
        this.initEventListeners();
        this.updateUI();
        this.gameLoop();
    }
    
    initMap() {
        // 0 = grass, 1 = path, 2 = water, 3 = tree, 4 = house, 5 = flower
        this.map = [
            [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
            [3,0,0,0,0,1,1,1,0,0,0,0,0,0,3],
            [3,0,5,0,0,1,0,1,0,0,5,0,0,0,3],
            [3,0,0,0,0,1,0,1,0,0,0,0,0,0,3],
            [3,1,1,1,1,1,0,1,1,1,1,1,1,0,3],
            [3,1,4,4,1,0,0,0,1,2,2,2,1,0,3],
            [3,1,4,4,1,0,0,0,1,2,2,2,1,0,3],
            [3,1,1,1,1,0,0,0,1,2,2,2,1,0,3],
            [3,0,0,0,0,0,0,0,1,1,1,1,1,0,3],
            [3,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
            [3,0,5,0,0,0,1,0,0,5,0,0,0,0,3],
            [3,0,0,0,0,0,1,0,0,0,0,0,0,0,3],
            [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
        ];
    }
    
    initLinguomon() {
        // Database of language monsters (words)
        this.linguomonDatabase = [
            // Spanish Words
            { id: 1, word: "hola", translation: "hello", language: "Spanish", emoji: "👋", difficulty: 1, type: "greeting" },
            { id: 2, word: "gato", translation: "cat", language: "Spanish", emoji: "🐱", difficulty: 1, type: "animal" },
            { id: 3, word: "casa", translation: "house", language: "Spanish", emoji: "🏠", difficulty: 1, type: "place" },
            { id: 4, word: "agua", translation: "water", language: "Spanish", emoji: "💧", difficulty: 1, type: "nature" },
            { id: 5, word: "libro", translation: "book", language: "Spanish", emoji: "📚", difficulty: 2, type: "object" },
            { id: 6, word: "amigo", translation: "friend", language: "Spanish", emoji: "🤝", difficulty: 2, type: "social" },
            { id: 7, word: "sol", translation: "sun", language: "Spanish", emoji: "☀️", difficulty: 1, type: "nature" },
            { id: 8, word: "luna", translation: "moon", language: "Spanish", emoji: "🌙", difficulty: 1, type: "nature" },
            
            // French Words
            { id: 9, word: "bonjour", translation: "hello", language: "French", emoji: "🇫🇷", difficulty: 2, type: "greeting" },
            { id: 10, word: "chat", translation: "cat", language: "French", emoji: "🐱", difficulty: 2, type: "animal" },
            { id: 11, word: "maison", translation: "house", language: "French", emoji: "🏠", difficulty: 2, type: "place" },
            { id: 12, word: "eau", translation: "water", language: "French", emoji: "💧", difficulty: 2, type: "nature" },
            { id: 13, word: "merci", translation: "thank you", language: "French", emoji: "🙏", difficulty: 1, type: "greeting" },
            
            // German Words
            { id: 14, word: "hallo", translation: "hello", language: "German", emoji: "🇩🇪", difficulty: 2, type: "greeting" },
            { id: 15, word: "katze", translation: "cat", language: "German", emoji: "🐱", difficulty: 2, type: "animal" },
            { id: 16, word: "haus", translation: "house", language: "German", emoji: "🏠", difficulty: 2, type: "place" },
            { id: 17, word: "wasser", translation: "water", language: "German", emoji: "💧", difficulty: 2, type: "nature" },
            { id: 18, word: "buch", translation: "book", language: "German", emoji: "📚", difficulty: 2, type: "object" },
            
            // Japanese Words
            { id: 19, word: "こんにちは", translation: "hello", language: "Japanese", emoji: "🇯🇵", difficulty: 3, type: "greeting" },
            { id: 20, word: "ねこ", translation: "cat", language: "Japanese", emoji: "🐱", difficulty: 3, type: "animal" },
            { id: 21, word: "みず", translation: "water", language: "Japanese", emoji: "💧", difficulty: 3, type: "nature" },
            { id: 22, word: "ほん", translation: "book", language: "Japanese", emoji: "📚", difficulty: 3, type: "object" },
        ];
    }
    
    initEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Open Linguodex with 'L' key
            if (e.key.toLowerCase() === 'l' && this.state === 'world') {
                this.openLinguodex();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Battle button listeners
        document.getElementById('fightBtn').addEventListener('click', () => this.handleFight());
        document.getElementById('catchBtn').addEventListener('click', () => this.handleCatch());
        document.getElementById('runBtn').addEventListener('click', () => this.handleRun());
        document.getElementById('useWordBtn').addEventListener('click', () => this.handleUseWord());
        document.getElementById('backBtn').addEventListener('click', () => this.showBattleMenu());
        document.getElementById('closeLinguodex').addEventListener('click', () => this.closeLinguodex());
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (this.state === 'world') {
            this.updatePlayer();
        }
    }
    
    updatePlayer() {
        const now = Date.now();
        if (now - this.lastMoveTime < this.moveDelay) return;
        
        let newX = this.player.x;
        let newY = this.player.y;
        let moved = false;
        
        if (this.keys['arrowup'] || this.keys['w']) {
            newY--;
            moved = true;
        } else if (this.keys['arrowdown'] || this.keys['s']) {
            newY++;
            moved = true;
        } else if (this.keys['arrowleft'] || this.keys['a']) {
            newX--;
            moved = true;
        } else if (this.keys['arrowright'] || this.keys['d']) {
            newX++;
            moved = true;
        }
        
        if (moved) {
            if (this.canMoveTo(newX, newY)) {
                this.player.x = newX;
                this.player.y = newY;
                this.lastMoveTime = now;
                
                // Check for random encounter in grass
                const tile = this.map[newY][newX];
                if (tile === 0 && Math.random() < 0.15) {
                    this.startBattle();
                }
            }
        }
    }
    
    canMoveTo(x, y) {
        if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) {
            return false;
        }
        
        const tile = this.map[y][x];
        // Can't walk on water (2), trees (3), or houses (4)
        return tile !== 2 && tile !== 3 && tile !== 4;
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw map
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const tile = this.map[y][x];
                this.drawTile(x, y, tile);
            }
        }
        
        // Draw player
        this.drawPlayer();
    }
    
    drawTile(x, y, type) {
        const px = x * this.tileSize;
        const py = y * this.tileSize;
        
        // Tile colors
        const colors = {
            0: '#90EE90', // grass - light green
            1: '#DEB887', // path - tan
            2: '#4169E1', // water - blue
            3: '#228B22', // tree - dark green
            4: '#8B4513', // house - brown
            5: '#FFB6C1'  // flower - pink
        };
        
        this.ctx.fillStyle = colors[type];
        this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
        
        // Draw details
        this.ctx.strokeStyle = '#00000022';
        this.ctx.strokeRect(px, py, this.tileSize, this.tileSize);
        
        // Add texture
        if (type === 0) { // grass
            this.ctx.fillStyle = '#7CCD7C';
            for (let i = 0; i < 3; i++) {
                const gx = px + Math.random() * this.tileSize;
                const gy = py + Math.random() * this.tileSize;
                this.ctx.fillRect(gx, gy, 2, 2);
            }
        } else if (type === 2) { // water
            this.ctx.fillStyle = '#6495ED';
            this.ctx.fillRect(px + 4, py + 4, this.tileSize - 8, this.tileSize - 8);
        } else if (type === 3) { // tree
            this.ctx.fillStyle = '#228B22';
            this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(px + 12, py + 20, 8, 12);
        } else if (type === 4) { // house
            this.ctx.fillStyle = '#CD853F';
            this.ctx.fillRect(px + 4, py + 8, this.tileSize - 8, this.tileSize - 8);
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(px + 12, py + 4, this.tileSize - 24, 8);
        } else if (type === 5) { // flower
            this.ctx.fillStyle = '#90EE90';
            this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
            this.ctx.fillStyle = '#FFB6C1';
            this.ctx.beginPath();
            this.ctx.arc(px + 16, py + 16, 6, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawPlayer() {
        const px = this.player.x * this.tileSize;
        const py = this.player.y * this.tileSize;
        
        // Draw player as a character
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.beginPath();
        this.ctx.arc(px + 16, py + 12, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#FFE66D';
        this.ctx.fillRect(px + 10, py + 18, 12, 10);
        
        // Arms
        this.ctx.fillStyle = '#FFE66D';
        this.ctx.fillRect(px + 6, py + 20, 4, 6);
        this.ctx.fillRect(px + 22, py + 20, 4, 6);
        
        // Legs
        this.ctx.fillStyle = '#4ECDC4';
        this.ctx.fillRect(px + 10, py + 26, 5, 6);
        this.ctx.fillRect(px + 17, py + 26, 5, 6);
    }
    
    // ============================================
    // BATTLE SYSTEM
    // ============================================
    
    startBattle() {
        this.state = 'battle';
        
        // Select random Linguomon based on player level
        const availableLinguomon = this.linguomonDatabase.filter(l => 
            l.difficulty <= Math.min(this.player.level + 1, 3)
        );
        const enemy = availableLinguomon[Math.floor(Math.random() * availableLinguomon.length)];
        
        this.currentBattle = {
            enemy: { ...enemy },
            playerHP: 100,
            enemyHP: 100,
            weakened: false
        };
        
        this.seenLinguomon.add(enemy.id);
        this.showBattleScreen();
        this.showBattleMessage(`A wild ${enemy.word} (${enemy.language}) appeared!`);
    }
    
    showBattleScreen() {
        this.battleScreen.classList.remove('hidden');
        this.updateBattleDisplay();
        this.showBattleMenu();
    }
    
    hideBattleScreen() {
        this.battleScreen.classList.add('hidden');
        this.quizSection.classList.add('hidden');
        this.wordSelection.classList.add('hidden');
        this.state = 'world';
        this.currentBattle = null;
    }
    
    updateBattleDisplay() {
        const enemy = this.currentBattle.enemy;
        document.getElementById('enemySprite').textContent = enemy.emoji;
        document.getElementById('enemyName').textContent = enemy.language;
        document.getElementById('enemyWord').textContent = enemy.word;
        document.getElementById('enemyLevel').textContent = `Lv.${enemy.difficulty}`;
        document.getElementById('playerBattleLevel').textContent = `Lv.${this.player.level}`;
    }
    
    showBattleMessage(message) {
        this.battleMessage.textContent = message;
    }
    
    showBattleMenu() {
        this.battleMenu.classList.remove('hidden');
        this.quizSection.classList.add('hidden');
        this.wordSelection.classList.add('hidden');
        
        // Enable/disable buttons
        const canUseWord = this.collectedLinguomon.length > 0;
        document.getElementById('useWordBtn').disabled = !canUseWord;
    }
    
    handleFight() {
        this.battleMenu.classList.add('hidden');
        this.createQuiz('fight');
    }
    
    handleCatch() {
        if (!this.currentBattle.weakened) {
            this.showBattleMessage("The Linguomon is too strong! Weaken it first by fighting!");
            setTimeout(() => this.showBattleMenu(), 2000);
            return;
        }
        
        this.battleMenu.classList.add('hidden');
        this.createQuiz('catch');
    }
    
    handleRun() {
        this.showBattleMessage("You ran away safely!");
        setTimeout(() => this.hideBattleScreen(), 1500);
    }
    
    handleUseWord() {
        this.battleMenu.classList.add('hidden');
        this.wordSelection.classList.remove('hidden');
        
        const wordList = document.getElementById('wordList');
        wordList.innerHTML = '';
        
        this.collectedLinguomon.forEach(linguomon => {
            const btn = document.createElement('button');
            btn.className = 'word-btn';
            btn.innerHTML = `
                <span class="word-native">${linguomon.word}</span>
                <span class="word-translation">${linguomon.translation}</span>
            `;
            btn.addEventListener('click', () => this.useWordInBattle(linguomon));
            wordList.appendChild(btn);
        });
    }
    
    useWordInBattle(linguomon) {
        this.wordSelection.classList.add('hidden');
        
        // Calculate damage based on word type matching
        const enemy = this.currentBattle.enemy;
        const typeMatch = linguomon.type === enemy.type;
        const damage = typeMatch ? 50 : 30;
        
        this.currentBattle.enemyHP -= damage;
        
        if (typeMatch) {
            this.showBattleMessage(`${linguomon.word} used ${linguomon.translation}! It's super effective!`);
        } else {
            this.showBattleMessage(`${linguomon.word} used ${linguomon.translation}!`);
        }
        
        setTimeout(() => {
            if (this.currentBattle.enemyHP <= 0) {
                this.winBattle();
            } else {
                this.currentBattle.weakened = true;
                this.showBattleMessage(`${enemy.word} is weakened! You can try to catch it now!`);
                setTimeout(() => this.showBattleMenu(), 2000);
            }
        }, 2000);
    }
    
    createQuiz(type) {
        const enemy = this.currentBattle.enemy;
        
        // Create quiz question
        let question, correctAnswer, wrongAnswers;
        
        if (Math.random() < 0.5) {
            // Translate from foreign language to English
            question = `What does "${enemy.word}" mean?`;
            correctAnswer = enemy.translation;
            
            // Get wrong answers
            wrongAnswers = this.linguomonDatabase
                .filter(l => l.id !== enemy.id && l.translation !== enemy.translation)
                .map(l => l.translation)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);
        } else {
            // Translate from English to foreign language
            question = `How do you say "${enemy.translation}" in ${enemy.language}?`;
            correctAnswer = enemy.word;
            
            // Get wrong answers from same language
            wrongAnswers = this.linguomonDatabase
                .filter(l => l.id !== enemy.id && l.language === enemy.language)
                .map(l => l.word)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);
        }
        
        // Mix answers
        const answers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
        
        this.currentQuiz = {
            type,
            correctAnswer,
            answers
        };
        
        this.displayQuiz(question, answers);
    }
    
    displayQuiz(question, answers) {
        this.quizSection.classList.remove('hidden');
        document.getElementById('quizQuestion').textContent = question;
        
        const answersDiv = document.getElementById('quizAnswers');
        answersDiv.innerHTML = '';
        
        answers.forEach(answer => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            btn.addEventListener('click', () => this.checkAnswer(answer, btn));
            answersDiv.appendChild(btn);
        });
    }
    
    checkAnswer(answer, button) {
        const correct = answer === this.currentQuiz.correctAnswer;
        
        // Disable all buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === this.currentQuiz.correctAnswer) {
                btn.classList.add('correct');
            } else if (btn === button && !correct) {
                btn.classList.add('incorrect');
            }
        });
        
        if (correct) {
            if (this.currentQuiz.type === 'catch') {
                this.catchLinguomon();
            } else {
                this.attackEnemy();
            }
        } else {
            this.showBattleMessage("Wrong answer! The Linguomon escaped!");
            setTimeout(() => this.hideBattleScreen(), 2000);
        }
    }
    
    attackEnemy() {
        const damage = 40;
        this.currentBattle.enemyHP -= damage;
        
        this.showBattleMessage("Correct! You dealt damage!");
        
        setTimeout(() => {
            if (this.currentBattle.enemyHP <= 0) {
                this.winBattle();
            } else {
                this.currentBattle.weakened = true;
                this.showBattleMessage("The Linguomon is weakened! Try catching it!");
                setTimeout(() => this.showBattleMenu(), 2000);
            }
        }, 1500);
    }
    
    catchLinguomon() {
        const enemy = this.currentBattle.enemy;
        this.collectedLinguomon.push(enemy);
        
        this.showBattleMessage(`🎉 Congratulations! You caught ${enemy.word}!`);
        this.gainExperience(20);
        
        setTimeout(() => this.hideBattleScreen(), 3000);
    }
    
    winBattle() {
        this.showBattleMessage("You defeated the Linguomon!");
        this.gainExperience(10);
        setTimeout(() => this.hideBattleScreen(), 2500);
    }
    
    gainExperience(amount) {
        this.player.experience += amount;
        
        // Level up every 50 experience
        const newLevel = Math.floor(this.player.experience / 50) + 1;
        if (newLevel > this.player.level) {
            this.player.level = newLevel;
            this.showBattleMessage(`Level Up! You are now level ${this.player.level}!`);
        }
        
        this.updateUI();
    }
    
    // ============================================
    // LINGUODEX (COLLECTION)
    // ============================================
    
    openLinguodex() {
        const screen = document.getElementById('linguodexScreen');
        const list = document.getElementById('linguodexList');
        
        list.innerHTML = '';
        
        if (this.collectedLinguomon.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: #666;">No Linguomon caught yet! Go explore!</p>';
        } else {
            // Group by id and count
            const grouped = {};
            this.collectedLinguomon.forEach(l => {
                if (!grouped[l.id]) {
                    grouped[l.id] = { ...l, count: 0 };
                }
                grouped[l.id].count++;
            });
            
            Object.values(grouped).forEach(linguomon => {
                const entry = document.createElement('div');
                entry.className = 'linguodex-entry';
                entry.innerHTML = `
                    <div class="entry-header">
                        <div>
                            <span class="sprite">${linguomon.emoji}</span>
                            <span class="word-info">${linguomon.word}</span>
                        </div>
                        <div class="level">Lv.${linguomon.difficulty}</div>
                    </div>
                    <div class="translation">${linguomon.translation} (${linguomon.language})</div>
                    <div class="catch-count">Caught: ${linguomon.count}x | Type: ${linguomon.type}</div>
                `;
                list.appendChild(entry);
            });
        }
        
        screen.classList.remove('hidden');
    }
    
    closeLinguodex() {
        document.getElementById('linguodexScreen').classList.add('hidden');
    }
    
    updateUI() {
        const totalLinguomon = this.linguomonDatabase.length;
        const caughtCount = new Set(this.collectedLinguomon.map(l => l.id)).size;
        
        document.getElementById('linguodex-count').textContent = 
            `Linguodex: ${caughtCount}/${totalLinguomon}`;
        document.getElementById('player-level').textContent = 
            `Level: ${this.player.level}`;
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new Game();
});
