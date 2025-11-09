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
        
        // Mobile control listeners
        this.initMobileControls();
    }
    
    initMobileControls() {
        // D-pad controls
        const btnUp = document.getElementById('btnUp');
        const btnDown = document.getElementById('btnDown');
        const btnLeft = document.getElementById('btnLeft');
        const btnRight = document.getElementById('btnRight');
        const btnCenter = document.getElementById('btnCenter');
        const btnLinguodex = document.getElementById('btnLinguodex');
        
        // Prevent default touch behavior
        const preventScroll = (e) => {
            e.preventDefault();
        };
        
        // Direction buttons - use both touch and mouse events for compatibility
        ['touchstart', 'mousedown'].forEach(eventType => {
            btnUp.addEventListener(eventType, (e) => {
                preventScroll(e);
                this.keys['arrowup'] = true;
            });
            btnDown.addEventListener(eventType, (e) => {
                preventScroll(e);
                this.keys['arrowdown'] = true;
            });
            btnLeft.addEventListener(eventType, (e) => {
                preventScroll(e);
                this.keys['arrowleft'] = true;
            });
            btnRight.addEventListener(eventType, (e) => {
                preventScroll(e);
                this.keys['arrowright'] = true;
            });
        });
        
        ['touchend', 'mouseup', 'touchcancel'].forEach(eventType => {
            btnUp.addEventListener(eventType, (e) => {
                preventScroll(e);
                this.keys['arrowup'] = false;
            });
            btnDown.addEventListener(eventType, (e) => {
                preventScroll(e);
                this.keys['arrowdown'] = false;
            });
            btnLeft.addEventListener(eventType, (e) => {
                preventScroll(e);
                this.keys['arrowleft'] = false;
            });
            btnRight.addEventListener(eventType, (e) => {
                preventScroll(e);
                this.keys['arrowright'] = false;
            });
        });
        
        // Center button (interact)
        btnCenter.addEventListener('touchstart', (e) => {
            preventScroll(e);
            this.keys[' '] = true;
        });
        btnCenter.addEventListener('touchend', (e) => {
            preventScroll(e);
            this.keys[' '] = false;
        });
        
        // Linguodex button
        btnLinguodex.addEventListener('click', (e) => {
            preventScroll(e);
            if (this.state === 'world') {
                this.openLinguodex();
            }
        });
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
        
        // Base colors with gradients
        if (type === 0) { // grass
            // Grass base
            const grassGradient = this.ctx.createLinearGradient(px, py, px, py + this.tileSize);
            grassGradient.addColorStop(0, '#7EC850');
            grassGradient.addColorStop(1, '#5FA033');
            this.ctx.fillStyle = grassGradient;
            this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
            
            // Add grass blades
            this.ctx.fillStyle = '#6FB83F';
            const blades = 4;
            for (let i = 0; i < blades; i++) {
                const bx = px + (i * 8) + 4;
                const by = py + ((i + x + y) % 3) * 10 + 8;
                this.ctx.fillRect(bx, by, 2, 6);
                this.ctx.fillRect(bx + 2, by - 2, 2, 4);
            }
            
        } else if (type === 1) { // path
            const pathGradient = this.ctx.createLinearGradient(px, py, px, py + this.tileSize);
            pathGradient.addColorStop(0, '#D4A574');
            pathGradient.addColorStop(1, '#B8935F');
            this.ctx.fillStyle = pathGradient;
            this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
            
            // Add path texture (stones)
            this.ctx.fillStyle = '#C9A06A';
            for (let i = 0; i < 3; i++) {
                const sx = px + ((i * 12 + x * 7) % 28) + 2;
                const sy = py + ((i * 8 + y * 11) % 28) + 2;
                this.ctx.fillRect(sx, sy, 3, 3);
            }
            
        } else if (type === 2) { // water
            const waterGradient = this.ctx.createRadialGradient(px + 16, py + 16, 0, px + 16, py + 16, 20);
            waterGradient.addColorStop(0, '#4DA6FF');
            waterGradient.addColorStop(1, '#2E75B5');
            this.ctx.fillStyle = waterGradient;
            this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
            
            // Add water shimmer
            const time = Date.now() / 1000;
            const wave = Math.sin(time * 2 + x + y) * 0.5 + 0.5;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${wave * 0.3})`;
            this.ctx.beginPath();
            this.ctx.arc(px + 16, py + 12, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
        } else if (type === 3) { // tree
            // Tree foliage
            const treeGradient = this.ctx.createRadialGradient(px + 16, py + 12, 0, px + 16, py + 12, 16);
            treeGradient.addColorStop(0, '#4CAF50');
            treeGradient.addColorStop(1, '#2E7D32');
            this.ctx.fillStyle = treeGradient;
            this.ctx.beginPath();
            this.ctx.arc(px + 16, py + 12, 14, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Tree trunk
            const trunkGradient = this.ctx.createLinearGradient(px + 12, py + 18, px + 20, py + 18);
            trunkGradient.addColorStop(0, '#6D4C41');
            trunkGradient.addColorStop(1, '#5D4037');
            this.ctx.fillStyle = trunkGradient;
            this.ctx.fillRect(px + 12, py + 18, 8, 14);
            
            // Highlight on foliage
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(px + 12, py + 8, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
        } else if (type === 4) { // house
            // House body
            const houseGradient = this.ctx.createLinearGradient(px + 4, py + 12, px + 28, py + 12);
            houseGradient.addColorStop(0, '#D4896B');
            houseGradient.addColorStop(1, '#B87456');
            this.ctx.fillStyle = houseGradient;
            this.ctx.fillRect(px + 4, py + 12, 24, 16);
            
            // Roof
            this.ctx.fillStyle = '#8B4513';
            this.ctx.beginPath();
            this.ctx.moveTo(px + 2, py + 12);
            this.ctx.lineTo(px + 16, py + 4);
            this.ctx.lineTo(px + 30, py + 12);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Roof highlight
            this.ctx.fillStyle = '#A0522D';
            this.ctx.beginPath();
            this.ctx.moveTo(px + 2, py + 12);
            this.ctx.lineTo(px + 16, py + 4);
            this.ctx.lineTo(px + 16, py + 6);
            this.ctx.lineTo(px + 4, py + 12);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Door
            this.ctx.fillStyle = '#5D4037';
            this.ctx.fillRect(px + 12, py + 18, 8, 10);
            
            // Window
            this.ctx.fillStyle = '#FFF9C4';
            this.ctx.fillRect(px + 20, py + 16, 5, 5);
            
        } else if (type === 5) { // flower
            // Grass base
            const flowerGrassGradient = this.ctx.createLinearGradient(px, py, px, py + this.tileSize);
            flowerGrassGradient.addColorStop(0, '#7EC850');
            flowerGrassGradient.addColorStop(1, '#5FA033');
            this.ctx.fillStyle = flowerGrassGradient;
            this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
            
            // Flower petals
            const time = Date.now() / 1000;
            const wobble = Math.sin(time * 2 + x + y) * 2;
            
            this.ctx.fillStyle = '#FF69B4';
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + wobble * 0.1;
                const petalX = px + 16 + Math.cos(angle) * 6;
                const petalY = py + 16 + Math.sin(angle) * 6;
                this.ctx.beginPath();
                this.ctx.arc(petalX, petalY, 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Flower center
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(px + 16, py + 16, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Stem
            this.ctx.strokeStyle = '#4CAF50';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(px + 16, py + 18);
            this.ctx.lineTo(px + 16, py + 26);
            this.ctx.stroke();
        }
        
        // Border
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(px, py, this.tileSize, this.tileSize);
    }
    
    drawPlayer() {
        const px = this.player.x * this.tileSize;
        const py = this.player.y * this.tileSize;
        const time = Date.now() / 500;
        const bounce = Math.abs(Math.sin(time)) * 2;
        
        // Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.beginPath();
        this.ctx.ellipse(px + 16, py + 30, 8, 3, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw player character with bounce
        const yOffset = -bounce;
        
        // Head with gradient
        const headGradient = this.ctx.createRadialGradient(px + 16, py + 10 + yOffset, 2, px + 16, py + 10 + yOffset, 10);
        headGradient.addColorStop(0, '#FFB6B9');
        headGradient.addColorStop(1, '#FF6B6B');
        this.ctx.fillStyle = headGradient;
        this.ctx.beginPath();
        this.ctx.arc(px + 16, py + 10 + yOffset, 9, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(px + 13, py + 9 + yOffset, 2, 0, Math.PI * 2);
        this.ctx.arc(px + 19, py + 9 + yOffset, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(px + 13, py + 10 + yOffset, 1, 0, Math.PI * 2);
        this.ctx.arc(px + 19, py + 10 + yOffset, 1, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Smile
        this.ctx.strokeStyle = '#FF4444';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(px + 16, py + 11 + yOffset, 3, 0, Math.PI);
        this.ctx.stroke();
        
        // Body with gradient
        const bodyGradient = this.ctx.createLinearGradient(px + 10, py + 18 + yOffset, px + 22, py + 18 + yOffset);
        bodyGradient.addColorStop(0, '#FFE66D');
        bodyGradient.addColorStop(1, '#FFCC00');
        this.ctx.fillStyle = bodyGradient;
        this.ctx.fillRect(px + 10, py + 18 + yOffset, 12, 10);
        
        // Arms with animation
        const armSwing = Math.sin(time * 2) * 2;
        this.ctx.fillStyle = '#FFE66D';
        
        // Left arm
        this.ctx.save();
        this.ctx.translate(px + 8, py + 20 + yOffset);
        this.ctx.rotate(armSwing * 0.1);
        this.ctx.fillRect(-2, 0, 4, 8);
        this.ctx.restore();
        
        // Right arm
        this.ctx.save();
        this.ctx.translate(px + 24, py + 20 + yOffset);
        this.ctx.rotate(-armSwing * 0.1);
        this.ctx.fillRect(-2, 0, 4, 8);
        this.ctx.restore();
        
        // Legs with gradient
        const legGradient = this.ctx.createLinearGradient(px + 10, py + 26 + yOffset, px + 22, py + 26 + yOffset);
        legGradient.addColorStop(0, '#4ECDC4');
        legGradient.addColorStop(1, '#3BA89F');
        this.ctx.fillStyle = legGradient;
        this.ctx.fillRect(px + 10, py + 26 + yOffset, 5, 6);
        this.ctx.fillRect(px + 17, py + 26 + yOffset, 5, 6);
        
        // Shoes
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.fillRect(px + 10, py + 30 + yOffset, 5, 2);
        this.ctx.fillRect(px + 17, py + 30 + yOffset, 5, 2);
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
