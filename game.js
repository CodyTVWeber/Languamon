// =============================================================
// Linguomon: Word League Adventure
// Core game script - overworld, encounters, battles and UI glue
// =============================================================

const TILE_TYPES = {
    GRASS: 0,
    PATH: 1,
    WATER: 2,
    TREE: 3,
    HOUSE: 4,
    FLOWER: 5,
};

const MAP_LAYOUT = [
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 0, 0, 5, 0, 0, 0, 1, 1, 1, 0, 0, 0, 5, 0, 0, 3],
    [3, 0, 4, 4, 0, 0, 0, 1, 4, 1, 0, 0, 0, 4, 4, 0, 3],
    [3, 0, 4, 4, 0, 0, 0, 1, 1, 1, 0, 0, 0, 4, 4, 0, 3],
    [3, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 3],
    [3, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 5, 0, 0, 1, 0, 2, 2, 2, 0, 0, 5, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 1, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 1, 0, 2, 2, 2, 0, 0, 0, 0, 0, 5, 3],
    [3, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3],
    [3, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 3],
    [3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 5, 0, 0, 0, 0, 1, 0, 5, 0, 0, 0, 5, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
];

const ENCOUNTER_RATES = {
    [TILE_TYPES.GRASS]: 0.14,
    [TILE_TYPES.FLOWER]: 0.22,
    [TILE_TYPES.PATH]: 0.03,
};

const FALLBACK_WRONGS = [
    'dawn',
    'compass',
    'friend',
    'music',
    'wind',
    'planet',
    'candle',
    'bridge',
    'journey',
    'circle',
];

const LANGUAGE_TRACKS = [
    {
        id: 'spanish',
        name: 'Spanish',
        emoji: '🇪🇸',
        difficulty: 'Beginner',
        region: 'Valle Verde',
        tagline: 'Warm greetings, everyday words, and sunny vibes.',
        habitats: [TILE_TYPES.GRASS, TILE_TYPES.FLOWER],
        lexicon: [
            { id: 'es-hola', word: 'hola', translation: 'hello', emoji: '👋', type: 'greeting', level: 1, clue: 'The first thing you say to new friends.' },
            { id: 'es-adios', word: 'adiós', translation: 'goodbye', emoji: '👋', type: 'greeting', level: 1, clue: 'Wave when you leave.' },
            { id: 'es-gato', word: 'gato', translation: 'cat', emoji: '🐱', type: 'animal', level: 1, clue: 'Soft paws and a curious tail.' },
            { id: 'es-casa', word: 'casa', translation: 'house', emoji: '🏠', type: 'place', level: 1, clue: 'Where you keep all your stuff.' },
            { id: 'es-agua', word: 'agua', translation: 'water', emoji: '💧', type: 'nature', level: 1, clue: 'Stay hydrated!' },
            { id: 'es-libro', word: 'libro', translation: 'book', emoji: '📚', type: 'object', level: 2, clue: 'Words bound together.' },
            { id: 'es-amigo', word: 'amigo', translation: 'friend', emoji: '🤝', type: 'social', level: 2, clue: 'Adventure buddy.' },
            { id: 'es-desayuno', word: 'desayuno', translation: 'breakfast', emoji: '🥐', type: 'food', level: 2, clue: 'Fuel for the morning.' },
        ],
    },
    {
        id: 'french',
        name: 'French',
        emoji: '🇫🇷',
        difficulty: 'Beginner+',
        region: 'Riviera Bleu',
        tagline: 'Polite phrases and cafe conversation starters.',
        habitats: [TILE_TYPES.GRASS, TILE_TYPES.PATH],
        lexicon: [
            { id: 'fr-bonjour', word: 'bonjour', translation: 'hello', emoji: '☀️', type: 'greeting', level: 1, clue: 'Good day!' },
            { id: 'fr-merci', word: 'merci', translation: 'thank you', emoji: '🙏', type: 'greeting', level: 1, clue: 'Grateful nod.' },
            { id: 'fr-chat', word: 'chat', translation: 'cat', emoji: '🐱', type: 'animal', level: 1, clue: 'Purring friend.' },
            { id: 'fr-maison', word: 'maison', translation: 'house', emoji: '🏠', type: 'place', level: 1, clue: 'Home sweet home.' },
            { id: 'fr-eau', word: 'eau', translation: 'water', emoji: '💧', type: 'nature', level: 2, clue: 'Crystal clear hydration.' },
            { id: 'fr-fromage', word: 'fromage', translation: 'cheese', emoji: '🧀', type: 'food', level: 2, clue: 'Pairs well with bread.' },
            { id: 'fr-pain', word: 'pain', translation: 'bread', emoji: '🥖', type: 'food', level: 2, clue: 'Fresh baguette aroma.' },
        ],
    },
    {
        id: 'german',
        name: 'German',
        emoji: '🇩🇪',
        difficulty: 'Intermediate',
        region: 'Wanderwald',
        tagline: 'Precise nouns and sturdy everyday expressions.',
        habitats: [TILE_TYPES.GRASS, TILE_TYPES.FLOWER],
        lexicon: [
            { id: 'de-hallo', word: 'hallo', translation: 'hello', emoji: '👋', type: 'greeting', level: 1, clue: 'Friendly wave.' },
            { id: 'de-bitte', word: 'bitte', translation: 'please', emoji: '🙂', type: 'social', level: 1, clue: 'Magic polite word.' },
            { id: 'de-danke', word: 'danke', translation: 'thank you', emoji: '🙏', type: 'social', level: 1, clue: 'Show appreciation.' },
            { id: 'de-katze', word: 'Katze', translation: 'cat', emoji: '🐱', type: 'animal', level: 2, clue: 'Curious whiskers.' },
            { id: 'de-haus', word: 'Haus', translation: 'house', emoji: '🏠', type: 'place', level: 2, clue: 'Four walls and a roof.' },
            { id: 'de-wasser', word: 'Wasser', translation: 'water', emoji: '💧', type: 'nature', level: 2, clue: 'Essential for life.' },
            { id: 'de-brot', word: 'Brot', translation: 'bread', emoji: '🍞', type: 'food', level: 2, clue: 'Fresh loaf smell.' },
            { id: 'de-buch', word: 'Buch', translation: 'book', emoji: '📚', type: 'object', level: 3, clue: 'Full of stories.' },
        ],
    },
    {
        id: 'japanese',
        name: 'Japanese',
        emoji: '🇯🇵',
        difficulty: 'Intermediate+',
        region: 'Hikari Trails',
        tagline: 'Friendly kana words to light your path.',
        habitats: [TILE_TYPES.GRASS, TILE_TYPES.FLOWER, TILE_TYPES.PATH],
        lexicon: [
            { id: 'jp-konnichiwa', word: 'こんにちは', translation: 'hello', emoji: '🌸', type: 'greeting', level: 1, clue: 'Midday greeting.' },
            { id: 'jp-arigato', word: 'ありがとう', translation: 'thank you', emoji: '🎎', type: 'social', level: 1, clue: 'Grateful bow.' },
            { id: 'jp-neko', word: 'ねこ', translation: 'cat', emoji: '🐱', type: 'animal', level: 2, clue: 'Clever whiskers.' },
            { id: 'jp-mizu', word: 'みず', translation: 'water', emoji: '💧', type: 'nature', level: 2, clue: 'Crystal clear.' },
            { id: 'jp-hon', word: 'ほん', translation: 'book', emoji: '📚', type: 'object', level: 2, clue: 'Knowledge bound.' },
            { id: 'jp-sora', word: 'そら', translation: 'sky', emoji: '☁️', type: 'nature', level: 3, clue: 'Look up!' },
            { id: 'jp-gohan', word: 'ごはん', translation: 'rice', emoji: '🍙', type: 'food', level: 3, clue: 'Staple meal.' },
        ],
    },
];

const ALL_WORDS = LANGUAGE_TRACKS.flatMap(track =>
    track.lexicon.map(word => ({
        ...word,
        language: track.name,
        trackId: track.id,
    })),
);

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function pickWrongAnswers(values, correct, count) {
    const unique = Array.from(new Set(values.filter(v => v && v !== correct)));
    const shuffled = shuffle(unique);
    const result = [];
    while (shuffled.length && result.length < count) {
        const candidate = shuffled.shift();
        if (!result.includes(candidate) && candidate !== correct) {
            result.push(candidate);
        }
    }
    let fallbackIndex = 0;
    while (result.length < count && fallbackIndex < FALLBACK_WRONGS.length) {
        const fallback = FALLBACK_WRONGS[fallbackIndex++];
        if (fallback !== correct && !result.includes(fallback)) {
            result.push(fallback);
        }
    }
    return result.slice(0, count);
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 32;
        this.map = MAP_LAYOUT;
        this.mapHeight = this.map.length;
        this.mapWidth = this.map[0].length;

        this.state = 'start'; // start | world | battle | dialogue
        this.player = {
            x: 8,
            y: 11,
            direction: 'down',
            level: 1,
            experience: 0,
            languageTrack: null,
        };

        this.keys = {};
        this.moveDelay = 150;
        this.moveCooldown = 0;
        this.stepsSinceEncounter = 3;

        this.seenWordIds = new Set();
        this.caughtWordIds = new Set();
        this.collectedLinguomon = [];

        this.currentBattle = null;
        this.currentQuiz = null;
        this.dialogueQueue = [];
        this.dialogueCallback = null;

        this.pendingTimeouts = [];
        this.activeToastTimer = null;
        this.lastFrameTime = performance.now();

        this.ui = {
            battleScreen: document.getElementById('battleScreen'),
            battleMessage: document.getElementById('battleMessage'),
            battleMenu: document.getElementById('battleMenu'),
            answerBtn: document.getElementById('answerBtn'),
            catchBtn: document.getElementById('catchBtn'),
            studyBtn: document.getElementById('studyBtn'),
            runBtn: document.getElementById('runBtn'),
            quizSection: document.getElementById('quizSection'),
            quizQuestion: document.getElementById('quizQuestion'),
            quizAnswers: document.getElementById('quizAnswers'),
            wordSelection: document.getElementById('wordSelection'),
            wordList: document.getElementById('wordList'),
            backBtn: document.getElementById('backBtn'),
            playerConfidence: document.getElementById('playerConfidence'),
            enemyConfidence: document.getElementById('enemyConfidence'),
            enemySprite: document.getElementById('enemySprite'),
            enemyName: document.getElementById('enemyName'),
            enemyWord: document.getElementById('enemyWord'),
            enemyLevel: document.getElementById('enemyLevel'),
            playerBattleLevel: document.getElementById('playerBattleLevel'),
            linguodexCount: document.getElementById('linguodex-count'),
            playerLevel: document.getElementById('player-level'),
            playerLanguage: document.getElementById('player-language'),
            startScreen: document.getElementById('startScreen'),
            languageChoices: document.getElementById('languageChoices'),
            randomLanguageBtn: document.getElementById('randomLanguageBtn'),
            dialogueOverlay: document.getElementById('dialogueOverlay'),
            dialogueText: document.getElementById('dialogueText'),
            dialoguePortrait: document.getElementById('dialoguePortrait'),
            dialogueNextBtn: document.getElementById('dialogueNextBtn'),
            linguodexScreen: document.getElementById('linguodexScreen'),
            linguodexList: document.getElementById('linguodexList'),
            closeLinguodex: document.getElementById('closeLinguodex'),
            toast: document.getElementById('toast'),
            btnLinguodex: document.getElementById('btnLinguodex'),
        };

        this.populateLanguageChoices();
        this.initEventListeners();
        this.initMobileControls();
        this.updateUI();
        this.gameLoop();
    }

    gameLoop(timestamp = performance.now()) {
        const delta = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        this.update(delta);
        this.render();

        requestAnimationFrame(t => this.gameLoop(t));
    }

    update(delta) {
        if (this.state === 'world') {
            this.moveCooldown = Math.max(0, this.moveCooldown - delta);
            this.handleMovement();
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                this.drawTile(x, y, this.map[y][x]);
            }
        }

        if (this.state !== 'start') {
            this.drawPlayer();
        } else {
            this.drawPlayer();
        }
    }

    drawTile(x, y, type) {
        const px = x * this.tileSize;
        const py = y * this.tileSize;
        const ctx = this.ctx;

        if (type === TILE_TYPES.GRASS) {
            const grad = ctx.createLinearGradient(px, py, px, py + this.tileSize);
            grad.addColorStop(0, '#7EC850');
            grad.addColorStop(1, '#5FA033');
            ctx.fillStyle = grad;
            ctx.fillRect(px, py, this.tileSize, this.tileSize);

            ctx.fillStyle = '#6FB83F';
            const blades = 4;
            for (let i = 0; i < blades; i++) {
                const bx = px + (i * 8) + 4;
                const by = py + ((i + x + y) % 3) * 10 + 8;
                ctx.fillRect(bx, by, 2, 6);
                ctx.fillRect(bx + 2, by - 2, 2, 4);
            }
        } else if (type === TILE_TYPES.PATH) {
            const grad = ctx.createLinearGradient(px, py, px, py + this.tileSize);
            grad.addColorStop(0, '#D4A574');
            grad.addColorStop(1, '#B8935F');
            ctx.fillStyle = grad;
            ctx.fillRect(px, py, this.tileSize, this.tileSize);

            ctx.fillStyle = '#C9A06A';
            for (let i = 0; i < 3; i++) {
                const sx = px + ((i * 12 + x * 7) % 28) + 2;
                const sy = py + ((i * 8 + y * 11) % 28) + 2;
                ctx.fillRect(sx, sy, 3, 3);
            }
        } else if (type === TILE_TYPES.WATER) {
            const grad = ctx.createRadialGradient(px + 16, py + 16, 0, px + 16, py + 16, 20);
            grad.addColorStop(0, '#4DA6FF');
            grad.addColorStop(1, '#2E75B5');
            ctx.fillStyle = grad;
            ctx.fillRect(px, py, this.tileSize, this.tileSize);

            const time = Date.now() / 1000;
            const wave = Math.sin(time * 2 + x + y) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${wave * 0.3})`;
            ctx.beginPath();
            ctx.arc(px + 16, py + 12, 4, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === TILE_TYPES.TREE) {
            const foliage = ctx.createRadialGradient(px + 16, py + 12, 0, px + 16, py + 12, 16);
            foliage.addColorStop(0, '#4CAF50');
            foliage.addColorStop(1, '#2E7D32');
            ctx.fillStyle = foliage;
            ctx.beginPath();
            ctx.arc(px + 16, py + 12, 14, 0, Math.PI * 2);
            ctx.fill();

            const trunk = ctx.createLinearGradient(px + 12, py + 18, px + 20, py + 18);
            trunk.addColorStop(0, '#6D4C41');
            trunk.addColorStop(1, '#5D4037');
            ctx.fillStyle = trunk;
            ctx.fillRect(px + 12, py + 18, 8, 14);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(px + 12, py + 8, 5, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === TILE_TYPES.HOUSE) {
            const body = ctx.createLinearGradient(px + 4, py + 12, px + 28, py + 12);
            body.addColorStop(0, '#D4896B');
            body.addColorStop(1, '#B87456');
            ctx.fillStyle = body;
            ctx.fillRect(px + 4, py + 12, 24, 16);

            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.moveTo(px + 2, py + 12);
            ctx.lineTo(px + 16, py + 4);
            ctx.lineTo(px + 30, py + 12);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#A0522D';
            ctx.beginPath();
            ctx.moveTo(px + 2, py + 12);
            ctx.lineTo(px + 16, py + 4);
            ctx.lineTo(px + 16, py + 6);
            ctx.lineTo(px + 4, py + 12);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#5D4037';
            ctx.fillRect(px + 12, py + 18, 8, 10);

            ctx.fillStyle = '#FFF9C4';
            ctx.fillRect(px + 20, py + 16, 5, 5);
        } else if (type === TILE_TYPES.FLOWER) {
            const grad = ctx.createLinearGradient(px, py, px, py + this.tileSize);
            grad.addColorStop(0, '#7EC850');
            grad.addColorStop(1, '#5FA033');
            ctx.fillStyle = grad;
            ctx.fillRect(px, py, this.tileSize, this.tileSize);

            const time = Date.now() / 1000;
            const wobble = Math.sin(time * 2 + x + y) * 2;
            ctx.fillStyle = '#FF69B4';
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + wobble * 0.1;
                const petalX = px + 16 + Math.cos(angle) * 6;
                const petalY = py + 16 + Math.sin(angle) * 6;
                ctx.beginPath();
                ctx.arc(petalX, petalY, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(px + 16, py + 16, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px + 16, py + 18);
            ctx.lineTo(px + 16, py + 26);
            ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, this.tileSize, this.tileSize);
    }

    drawPlayer() {
        const px = this.player.x * this.tileSize;
        const py = this.player.y * this.tileSize;
        const time = Date.now() / 500;
        const bounce = Math.abs(Math.sin(time)) * 2;
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(px + 16, py + 30, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        const yOffset = -bounce;

        const headGradient = ctx.createRadialGradient(px + 16, py + 10 + yOffset, 2, px + 16, py + 10 + yOffset, 10);
        headGradient.addColorStop(0, '#FFB6B9');
        headGradient.addColorStop(1, '#FF6B6B');
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(px + 16, py + 10 + yOffset, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px + 13, py + 9 + yOffset, 2, 0, Math.PI * 2);
        ctx.arc(px + 19, py + 9 + yOffset, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(px + 13, py + 10 + yOffset, 1, 0, Math.PI * 2);
        ctx.arc(px + 19, py + 10 + yOffset, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px + 16, py + 11 + yOffset, 3, 0, Math.PI);
        ctx.stroke();

        const bodyGradient = ctx.createLinearGradient(px + 10, py + 18 + yOffset, px + 22, py + 18 + yOffset);
        bodyGradient.addColorStop(0, '#FFE66D');
        bodyGradient.addColorStop(1, '#FFCC00');
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(px + 10, py + 18 + yOffset, 12, 10);

        const armSwing = Math.sin(time * 2) * 2;
        ctx.fillStyle = '#FFE66D';

        ctx.save();
        ctx.translate(px + 8, py + 20 + yOffset);
        ctx.rotate(armSwing * 0.1);
        ctx.fillRect(-2, 0, 4, 8);
        ctx.restore();

        ctx.save();
        ctx.translate(px + 24, py + 20 + yOffset);
        ctx.rotate(-armSwing * 0.1);
        ctx.fillRect(-2, 0, 4, 8);
        ctx.restore();

        const legGradient = ctx.createLinearGradient(px + 10, py + 26 + yOffset, px + 22, py + 26 + yOffset);
        legGradient.addColorStop(0, '#4ECDC4');
        legGradient.addColorStop(1, '#3BA89F');
        ctx.fillStyle = legGradient;
        ctx.fillRect(px + 10, py + 26 + yOffset, 5, 6);
        ctx.fillRect(px + 17, py + 26 + yOffset, 5, 6);

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(px + 10, py + 30 + yOffset, 5, 2);
        ctx.fillRect(px + 17, py + 30 + yOffset, 5, 2);
    }

    setState(newState) {
        this.state = newState;
    }

    handleMovement() {
        if (this.moveCooldown > 0) return;

        let dx = 0;
        let dy = 0;

        if (this.keys.arrowup || this.keys.w) {
            dy = -1;
            this.player.direction = 'up';
        } else if (this.keys.arrowdown || this.keys.s) {
            dy = 1;
            this.player.direction = 'down';
        } else if (this.keys.arrowleft || this.keys.a) {
            dx = -1;
            this.player.direction = 'left';
        } else if (this.keys.arrowright || this.keys.d) {
            dx = 1;
            this.player.direction = 'right';
        }

        if (dx === 0 && dy === 0) return;

        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        if (!this.canMoveTo(newX, newY)) {
            this.moveCooldown = this.moveDelay * 0.5;
            return;
        }

        this.player.x = newX;
        this.player.y = newY;
        this.moveCooldown = this.moveDelay;

        const tile = this.map[newY][newX];
        this.handleTileStep(tile);
    }

    canMoveTo(x, y) {
        if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) {
            return false;
        }
        const tile = this.map[y][x];
        return tile !== TILE_TYPES.WATER && tile !== TILE_TYPES.TREE && tile !== TILE_TYPES.HOUSE;
    }

    handleTileStep(tile) {
        if (!this.player.languageTrack) return;

        this.stepsSinceEncounter = Math.min(999, this.stepsSinceEncounter + 1);
        const baseRate = ENCOUNTER_RATES[tile];
        if (!baseRate || this.stepsSinceEncounter < 2) {
            return;
        }

        const levelBonus = Math.max(0, (this.player.level - 1) * 0.01);
        if (Math.random() < baseRate + levelBonus) {
            this.stepsSinceEncounter = 0;
            this.startBattle();
        }
    }

    startBattle() {
        const track = this.player.languageTrack;
        if (!track) return;

        const available = track.lexicon.filter(word => word.level <= this.player.level + 1);
        const pool = available.length ? available : track.lexicon;
        const uncaught = pool.filter(word => !this.caughtWordIds.has(word.id));
        const target = (uncaught.length ? uncaught : pool)[Math.floor(Math.random() * (uncaught.length ? uncaught.length : pool.length))];

        const enemy = {
            ...target,
            language: track.name,
            trackId: track.id,
        };

        const enemyMaxConfidence = Math.min(4, 2 + Math.ceil(enemy.level));
        const playerMaxConfidence = Math.min(4, 3 + Math.floor(this.player.level / 3));

        this.currentBattle = {
            enemy,
            enemyConfidence: enemyMaxConfidence,
            enemyMaxConfidence,
            playerConfidence: playerMaxConfidence,
            playerMaxConfidence,
            pendingIntent: null,
        };

        this.seenWordIds.add(enemy.id);
        this.setState('battle');
        this.clearPendingTimeouts();

        this.ui.battleScreen.classList.remove('hidden');
        this.ui.quizSection.classList.add('hidden');
        this.ui.wordSelection.classList.add('hidden');
        this.ui.battleMenu.classList.remove('hidden');

        this.updateBattleUI();
        this.showBattleMessage(`A wild ${enemy.word} (${track.name}) appeared!`);
    }

    showBattleMessage(message) {
        this.ui.battleMessage.textContent = message;
    }

    updateBattleUI() {
        if (!this.currentBattle) return;

        const { enemy, enemyConfidence, enemyMaxConfidence, playerConfidence, playerMaxConfidence } = this.currentBattle;

        this.ui.enemySprite.textContent = enemy.emoji;
        this.ui.enemyName.textContent = enemy.word;
        this.ui.enemyWord.textContent = `${enemy.translation}`;
        this.ui.enemyLevel.textContent = `Lv.${enemy.level}`;
        this.ui.playerBattleLevel.textContent = `Lv.${this.player.level}`;

        this.renderConfidence(this.ui.enemyConfidence, enemyConfidence, enemyMaxConfidence);
        this.renderConfidence(this.ui.playerConfidence, playerConfidence, playerMaxConfidence);

        this.updateBattleButtons();
    }

    renderConfidence(element, current, max) {
        if (!element) return;
        element.innerHTML = '';
        for (let i = 0; i < max; i++) {
            const span = document.createElement('span');
            span.className = `heart${i >= current ? ' empty' : ''}`;
            span.textContent = i < current ? '❤️' : '🤍';
            element.appendChild(span);
        }
    }

    updateBattleButtons() {
        if (!this.currentBattle) return;
        this.ui.answerBtn.disabled = false;
        this.ui.studyBtn.disabled = this.collectedLinguomon.length === 0;
        this.ui.catchBtn.disabled = this.currentBattle.enemyConfidence > 1;
    }

    prepareQuiz(intent) {
        if (!this.currentBattle) return;

        const payload = this.generateQuestion(intent);
        this.currentBattle.pendingIntent = intent;
        this.currentQuiz = {
            intent,
            question: payload.question,
            answers: payload.answers,
            correctAnswer: payload.correctAnswer,
        };

        this.ui.quizSection.classList.remove('hidden');
        this.ui.battleMenu.classList.add('hidden');
        this.ui.wordSelection.classList.add('hidden');

        this.ui.quizQuestion.textContent = payload.question;
        this.ui.quizAnswers.innerHTML = '';

        payload.answers.forEach(answer => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            btn.addEventListener('click', () => this.handleAnswerSelection(answer, btn));
            this.ui.quizAnswers.appendChild(btn);
        });
    }

    generateQuestion(intent) {
        const { enemy } = this.currentBattle;
        const track = this.player.languageTrack;
        const lexicon = track.lexicon;
        const templates = [];

        if (lexicon.length >= 4) {
            templates.push('toEnglish', 'toForeign');
        } else {
            templates.push('toEnglish');
        }

        const typeSet = new Set(lexicon.map(word => word.type));
        if (typeSet.size >= 4) {
            templates.push('category');
        }

        const template = randomChoice(templates);

        if (template === 'toForeign') {
            const wrongs = pickWrongAnswers(
                lexicon.map(word => word.word),
                enemy.word,
                3,
            );
            const answers = shuffle([enemy.word, ...wrongs]);
            return {
                question: `How do you say "${enemy.translation}" in ${track.name}?`,
                answers,
                correctAnswer: enemy.word,
            };
        }

        if (template === 'category') {
            const wrongs = pickWrongAnswers(
                lexicon.map(word => word.type),
                enemy.type,
                3,
            );
            const answers = shuffle([enemy.type, ...wrongs]);
            return {
                question: `Which category best fits "${enemy.word}"?`,
                answers,
                correctAnswer: enemy.type,
            };
        }

        // Default: translate into English
        const wrongTranslations = pickWrongAnswers(
            ALL_WORDS.map(word => word.translation),
            enemy.translation,
            3,
        );
        const answers = shuffle([enemy.translation, ...wrongTranslations]);
        return {
            question: `What does "${enemy.word}" mean?`,
            answers,
            correctAnswer: enemy.translation,
        };
    }

    handleAnswerSelection(answer, button) {
        if (!this.currentQuiz) return;

        const buttons = Array.from(this.ui.quizAnswers.querySelectorAll('.answer-btn'));
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === this.currentQuiz.correctAnswer) {
                btn.classList.add('correct');
            } else if (btn === button) {
                btn.classList.add(answer === this.currentQuiz.correctAnswer ? 'correct' : 'incorrect');
            }
        });

        const isCorrect = answer === this.currentQuiz.correctAnswer;
        this.scheduleTimeout(() => this.resolveQuizResult(isCorrect), 750);
    }

    resolveQuizResult(correct) {
        if (!this.currentBattle || !this.currentQuiz) return;
        const intent = this.currentQuiz.intent;
        this.currentQuiz = null;

        if (intent === 'attack') {
            this.handleAttackResult(correct);
        } else if (intent === 'catch') {
            this.handleCatchResult(correct);
        }
    }

    handleAttackResult(correct) {
        if (!this.currentBattle) return;
        const battle = this.currentBattle;
        const enemy = battle.enemy;

        if (correct) {
            battle.enemyConfidence = Math.max(0, battle.enemyConfidence - 1);
            this.updateBattleUI();

            if (battle.enemyConfidence <= 0) {
                this.showBattleMessage(`${enemy.word} bolts away before you can capture it!`);
                this.gainExperience(12 + enemy.level * 3);
                this.scheduleTimeout(() => this.endBattle(false), 1600);
                return;
            }

            if (battle.enemyConfidence === 1) {
                this.showBattleMessage(`Great! ${enemy.word} looks ready to be caught.`);
            } else {
                this.showBattleMessage(`Correct! ${enemy.word} wavers.`);
            }

            this.scheduleTimeout(() => this.showBattleMenu(), 900);
        } else {
            battle.playerConfidence = Math.max(0, battle.playerConfidence - 1);
            this.updateBattleUI();

            if (battle.playerConfidence <= 0) {
                this.showBattleMessage('You ran out of confidence. The Linguomon dashes away!');
                this.scheduleTimeout(() => this.endBattle(false), 1500);
                return;
            }

            this.showBattleMessage('Not quite. Take a breath and try again.');
            this.scheduleTimeout(() => this.showBattleMenu(), 900);
        }
    }

    handleCatchResult(correct) {
        if (!this.currentBattle) return;
        const enemy = this.currentBattle.enemy;

        if (correct) {
            this.captureEnemy();
        } else {
            this.showBattleMessage(`${enemy.word} slips free and escapes!`);
            this.scheduleTimeout(() => this.endBattle(false), 1500);
        }
    }

    captureEnemy() {
        if (!this.currentBattle) return;
        const enemy = this.currentBattle.enemy;

        if (!this.caughtWordIds.has(enemy.id)) {
            this.collectedLinguomon.push({
                ...enemy,
                capturedAt: Date.now(),
            });
            this.caughtWordIds.add(enemy.id);
        }

        this.showBattleMessage(`🎉 ${enemy.word} joined your lexicon!`);
        this.showToast(`${enemy.word} = ${enemy.translation}`);
        this.gainExperience(20 + enemy.level * 6);
        this.updateUI();
        this.scheduleTimeout(() => this.endBattle(true), 2000);
    }

    showBattleMenu() {
        if (!this.currentBattle) return;
        this.ui.quizSection.classList.add('hidden');
        this.ui.wordSelection.classList.add('hidden');
        this.ui.battleMenu.classList.remove('hidden');
        this.updateBattleButtons();
    }

    endBattle(caught) {
        this.clearPendingTimeouts();
        if (!this.currentBattle) return;

        this.currentBattle = null;
        this.currentQuiz = null;

        this.ui.battleScreen.classList.add('hidden');
        this.ui.quizSection.classList.add('hidden');
        this.ui.wordSelection.classList.add('hidden');
        this.ui.battleMenu.classList.remove('hidden');

        this.setState('world');
        this.stepsSinceEncounter = 0;
        this.updateUI();

        if (caught) {
            this.showToast('Word added to your Linguodex!');
        }
    }

    gainExperience(amount) {
        this.player.experience += amount;
        const newLevel = Math.floor(this.player.experience / 60) + 1;
        if (newLevel > this.player.level) {
            this.player.level = newLevel;
            this.showToast(`Level up! You are now level ${this.player.level}.`, 2600);
            if (this.state === 'battle') {
                this.showBattleMessage(`Your confidence surges! Level ${this.player.level}.`);
            }
        }
        this.updateUI();
    }

    populateLanguageChoices() {
        if (!this.ui.languageChoices) return;
        this.ui.languageChoices.innerHTML = '';

        LANGUAGE_TRACKS.forEach(track => {
            const btn = document.createElement('button');
            btn.className = 'language-choice';
            btn.innerHTML = `
                <div class="lang-name">${track.emoji} ${track.name}</div>
                <div class="lang-desc">${track.tagline}</div>
                <div class="lang-meta">
                    <span>${track.difficulty}</span>
                    <span>${track.region}</span>
                </div>
            `;
            btn.addEventListener('click', () => this.beginAdventure(track.id));
            this.ui.languageChoices.appendChild(btn);
        });

        this.ui.randomLanguageBtn.addEventListener('click', () => {
            const randomTrack = randomChoice(LANGUAGE_TRACKS);
            this.beginAdventure(randomTrack.id);
        });
    }

    beginAdventure(trackId) {
        const track = LANGUAGE_TRACKS.find(t => t.id === trackId);
        if (!track) return;

        this.player.languageTrack = track;
        this.player.x = 8;
        this.player.y = 11;
        this.stepsSinceEncounter = 3;

        if (this.ui.startScreen) {
            this.ui.startScreen.classList.add('hidden');
        }

        this.queueDialogue(
            [
                {
                    portrait: '🧑‍🏫',
                    text: `Welcome to ${track.region}! This is the ${track.name} track.`,
                },
                {
                    portrait: '🧑‍🏫',
                    text: 'Walk through tall grass and flowers to encounter new Linguomon.',
                },
                {
                    portrait: '🧑‍🏫',
                    text: 'Answer questions to lower their confidence, then catch them to study later!',
                },
            ],
            () => {
                this.setState('world');
                this.showToast(`Adventure started on the ${track.name} track!`);
            },
        );

        this.updateUI();
    }

    queueDialogue(lines, onComplete) {
        this.dialogueQueue = Array.isArray(lines) ? [...lines] : [];
        this.dialogueCallback = onComplete || null;
        this.setState('dialogue');
        this.advanceDialogue();
        if (this.ui.dialogueOverlay) {
            this.ui.dialogueOverlay.classList.remove('hidden');
        }
    }

    advanceDialogue() {
        if (this.dialogueQueue.length === 0) {
            if (this.ui.dialogueOverlay) {
                this.ui.dialogueOverlay.classList.add('hidden');
            }
            const callback = this.dialogueCallback;
            this.dialogueCallback = null;
            if (callback) callback();
            return;
        }

        const entry = this.dialogueQueue.shift();
        this.ui.dialoguePortrait.textContent = entry.portrait || '🧑‍🏫';
        this.ui.dialogueText.textContent = entry.text;
    }

    showStudyMenu() {
        if (!this.currentBattle) return;

        if (this.collectedLinguomon.length === 0) {
            this.showToast('Catch some Linguomon to study with first!');
            return;
        }

        this.ui.battleMenu.classList.add('hidden');
        this.ui.quizSection.classList.add('hidden');
        this.ui.wordSelection.classList.remove('hidden');

        const unique = {};
        this.collectedLinguomon.forEach(word => {
            if (!unique[word.id]) {
                unique[word.id] = word;
            }
        });

        this.ui.wordList.innerHTML = '';
        Object.values(unique).forEach(word => {
            const btn = document.createElement('button');
            btn.className = 'word-btn';
            btn.innerHTML = `
                <span class="word-native">${word.word}</span>
                <span class="word-translation">${word.translation}</span>
            `;
            btn.addEventListener('click', () => this.useStudyWord(word));
            this.ui.wordList.appendChild(btn);
        });
    }

    useStudyWord(word) {
        if (!this.currentBattle) return;
        const battle = this.currentBattle;
        const enemy = battle.enemy;

        this.ui.wordSelection.classList.add('hidden');

        let message = `You review ${word.word} (${word.translation}).`;
        let changed = false;

        if (battle.playerConfidence < battle.playerMaxConfidence) {
            battle.playerConfidence += 1;
            changed = true;
            message += ' Your confidence grows.';
        }

        if (word.type === enemy.type && battle.enemyConfidence > 1) {
            battle.enemyConfidence -= 1;
            changed = true;
            message += ` ${enemy.word} looks impressed!`;
        }

        if (!changed) {
            message += ' You feel ready for the next challenge.';
        }

        this.updateBattleUI();
        this.showBattleMessage(message);
        this.scheduleTimeout(() => this.showBattleMenu(), 1400);
    }

    updateUI() {
        const totalEntries = LANGUAGE_TRACKS.reduce((sum, track) => sum + track.lexicon.length, 0);
        const uniqueCaught = this.collectedLinguomon.reduce((set, word) => set.add(word.id), new Set()).size;

        if (this.ui.linguodexCount) {
            this.ui.linguodexCount.textContent = `Dex: ${uniqueCaught}/${totalEntries}`;
        }
        if (this.ui.playerLevel) {
            this.ui.playerLevel.textContent = `Level: ${this.player.level}`;
        }
        if (this.ui.playerLanguage) {
            this.ui.playerLanguage.textContent = `Track: ${this.player.languageTrack ? this.player.languageTrack.name : '—'}`;
        }
    }

    openLinguodex() {
        if (this.state !== 'world' && this.state !== 'battle') return;
        const list = this.ui.linguodexList;
        if (!list) return;

        list.innerHTML = '';
        const track = this.player.languageTrack;

        if (!track) {
            list.innerHTML = '<p style="text-align:center;color:#666;">Pick a language track to begin your Linguodex adventure!</p>';
        } else {
            track.lexicon.forEach(word => {
                const status = this.caughtWordIds.has(word.id)
                    ? 'Caught'
                    : this.seenWordIds.has(word.id)
                        ? 'Seen'
                        : 'Unseen';

                const entry = document.createElement('div');
                entry.className = 'linguodex-entry';
                if (status === 'Caught') {
                    entry.style.borderLeftColor = '#06d6a0';
                } else if (status === 'Seen') {
                    entry.style.borderLeftColor = '#fbbf24';
                } else {
                    entry.style.borderLeftColor = '#94a3b8';
                    entry.style.opacity = '0.7';
                }

                entry.innerHTML = `
                    <div class="entry-header">
                        <div>
                            <span class="sprite">${word.emoji}</span>
                            <span class="word-info">${word.word}</span>
                        </div>
                        <div class="level">Lv.${word.level}</div>
                    </div>
                    <div class="translation">${word.translation} (${track.name})</div>
                    <div class="catch-count">Status: ${status}${status === 'Caught' ? ` | Type: ${word.type}` : ''}</div>
                `;
                list.appendChild(entry);
            });
        }

        this.ui.linguodexScreen.classList.remove('hidden');
    }

    closeLinguodex() {
        this.ui.linguodexScreen.classList.add('hidden');
    }

    showToast(message, duration = 2000) {
        if (!this.ui.toast) return;
        this.ui.toast.textContent = message;
        this.ui.toast.classList.remove('hidden');

        if (this.activeToastTimer) {
            clearTimeout(this.activeToastTimer);
        }
        this.activeToastTimer = setTimeout(() => {
            this.ui.toast.classList.add('hidden');
            this.activeToastTimer = null;
        }, duration);
    }

    scheduleTimeout(callback, delay) {
        const id = setTimeout(() => {
            this.pendingTimeouts = this.pendingTimeouts.filter(t => t !== id);
            callback();
        }, delay);
        this.pendingTimeouts.push(id);
    }

    clearPendingTimeouts() {
        this.pendingTimeouts.forEach(id => clearTimeout(id));
        this.pendingTimeouts = [];
    }

    handleRun() {
        if (!this.currentBattle) return;
        this.showBattleMessage('You step back to regroup.');
        this.scheduleTimeout(() => this.endBattle(false), 1000);
    }

    handleCatchAttempt() {
        if (!this.currentBattle) return;
        if (this.currentBattle.enemyConfidence > 1) {
            this.showBattleMessage('Weaken the Linguomon a bit more before catching it.');
            this.showToast('Lower its confidence first!');
            return;
        }
        this.prepareQuiz('catch');
    }

    handleAnswerIntent() {
        if (!this.currentBattle) return;
        this.prepareQuiz('attack');
    }

    initEventListeners() {
        document.addEventListener('keydown', e => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            const key = e.key.toLowerCase();

            if (this.state === 'dialogue' && (key === ' ' || key === 'enter')) {
                this.advanceDialogue();
                return;
            }

            if (key === 'l') {
                if (this.state === 'world') {
                    this.openLinguodex();
                }
                return;
            }

            if (key === ' ' && this.state === 'world') {
                return;
            }

            if (key === ' ' && this.state === 'battle' && this.currentBattle) {
                if (this.ui.quizSection.classList.contains('hidden') && this.ui.wordSelection.classList.contains('hidden')) {
                    this.handleAnswerIntent();
                }
                return;
            }

            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
                this.keys[key] = true;
            }
        });

        document.addEventListener('keyup', e => {
            const key = e.key.toLowerCase();
            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
                this.keys[key] = false;
            }
        });

        this.ui.dialogueNextBtn.addEventListener('click', () => this.advanceDialogue());
        this.ui.answerBtn.addEventListener('click', () => this.handleAnswerIntent());
        this.ui.catchBtn.addEventListener('click', () => this.handleCatchAttempt());
        this.ui.studyBtn.addEventListener('click', () => this.showStudyMenu());
        this.ui.runBtn.addEventListener('click', () => this.handleRun());
        this.ui.backBtn.addEventListener('click', () => this.showBattleMenu());
        this.ui.closeLinguodex.addEventListener('click', () => this.closeLinguodex());
        if (this.ui.btnLinguodex) {
            this.ui.btnLinguodex.addEventListener('click', e => {
                e.preventDefault();
                if (this.state === 'world') {
                    this.openLinguodex();
                }
            });
        }
    }

    initMobileControls() {
        const prevent = e => e.preventDefault();
        const bindDirectional = (id, key) => {
            const button = document.getElementById(id);
            if (!button) return;
            ['touchstart', 'mousedown'].forEach(evt => {
                button.addEventListener(evt, e => {
                    prevent(e);
                    this.keys[key] = true;
                });
            });
            ['touchend', 'mouseup', 'touchcancel', 'mouseleave'].forEach(evt => {
                button.addEventListener(evt, e => {
                    prevent(e);
                    this.keys[key] = false;
                });
            });
        };

        bindDirectional('btnUp', 'arrowup');
        bindDirectional('btnDown', 'arrowdown');
        bindDirectional('btnLeft', 'arrowleft');
        bindDirectional('btnRight', 'arrowright');

        const btnCenter = document.getElementById('btnCenter');
        if (btnCenter) {
            ['touchstart', 'mousedown'].forEach(evt => {
                btnCenter.addEventListener(evt, e => {
                    prevent(e);
                    if (this.state === 'dialogue') {
                        this.advanceDialogue();
                    } else if (this.state === 'battle') {
                        this.handleAnswerIntent();
                    }
                });
            });
        }
    }
}

window.addEventListener('load', () => {
    new Game();
});
