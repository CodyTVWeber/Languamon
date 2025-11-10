import kaboom from "https://unpkg.com/kaboom@3000.1.17/dist/kaboom.mjs";

const TILE_SIZE = 16;
const MOVE_SPEED = 96;
const MAX_HUD_LOG = 4;

const PALETTE = {
    darkest: "#10241b",
    dark: "#1d6538",
    mid: "#3d9c5a",
    light: "#8fe8a4",
    highlight: "#f3ffd8",
    accent: "#f2f6ff",
    muted: "#a6d9be",
    earth: "#d3904f",
    water: "#2e86e3",
    bloom: "#f277ce",
};

const MAP_LAYOUT = [
    "TTTTTTTTTTTTTTTTTT",
    "TGGGGGPPPPPPPPGGGT",
    "TGPPPGGGGGGGGGPPGT",
    "TGPPWWGGGGTTGGPPGT",
    "TGPPPSPFGGTGGPPPGT",
    "TGGGGGGGGGTGGGGGGT",
    "TGGGGGGGGGTGGGPPGT",
    "TGPPPPPPPPPPPPPPGT",
    "TGGGGGGGGGGGGGGGGT",
    "TTTTTTTTTTTTTTTTTT",
];

const SIGN_TEXT = new Map([
    [
        "5,4",
        [
            "Trail Sign: Press SPACE to interact or continue dialogue.",
            "Step into shimmering grass to test your vocabulary skills.",
        ],
    ],
    [
        "7,4",
        [
            "Tip: Use the L key to review the words you've already captured.",
            "Level up by answering correctly to raise encounter variety.",
        ],
    ],
]);

const LANGUAGE_TRACKS = [
    {
        id: "spanish",
        name: "Español",
        region: "Valle Verde",
        description: "Sunny greetings and everyday essentials from the valley.",
        intro: [
            "¡Bienvenido! Valle Verde hums with friendly Spanish.",
            "Walk through the tall grass to meet words in the wild.",
            "Answer correctly to build your LexiLog and gain confidence.",
        ],
        lexicon: [
            { id: "es-hola", word: "hola", translation: "hello", part: "greeting", clue: "Friendly hello you use all day." },
            { id: "es-adios", word: "adiós", translation: "goodbye", part: "greeting", clue: "A wave as you head out." },
            { id: "es-gracias", word: "gracias", translation: "thank you", part: "expression", clue: "Grateful magic word." },
            { id: "es-pan", word: "pan", translation: "bread", part: "food", clue: "Fresh from the bakery." },
            { id: "es-agua", word: "agua", translation: "water", part: "nature", clue: "Crystal clear hydration." },
            { id: "es-gato", word: "gato", translation: "cat", part: "creature", clue: "Soft paws and curious whiskers." },
            { id: "es-libro", word: "libro", translation: "book", part: "object", clue: "Pages filled with stories." },
            { id: "es-escuchar", word: "escuchar", translation: "to listen", part: "verb", clue: "Use your ears." },
        ],
    },
    {
        id: "french",
        name: "Français",
        region: "Riviera Bleu",
        description: "Café conversations, polite phrases, and cozy comforts.",
        intro: [
            "Bienvenue à la Riviera Bleu! The air buzzes with French phrases.",
            "Polish your listening — the right answers will capture new words.",
            "Keep moving, keep practicing. Your accent mark adventure starts now!",
        ],
        lexicon: [
            { id: "fr-bonjour", word: "bonjour", translation: "hello", part: "greeting", clue: "Good day with a smile." },
            { id: "fr-merci", word: "merci", translation: "thank you", part: "expression", clue: "Polite gratitude." },
            { id: "fr-au-revoir", word: "au revoir", translation: "goodbye", part: "greeting", clue: "Until we meet again." },
            { id: "fr-eau", word: "eau", translation: "water", part: "nature", clue: "Quietly flowing." },
            { id: "fr-pain", word: "pain", translation: "bread", part: "food", clue: "Fresh baguette aroma." },
            { id: "fr-chat", word: "chat", translation: "cat", part: "creature", clue: "Gentle purrs by the window." },
            { id: "fr-livre", word: "livre", translation: "book", part: "object", clue: "Stories in neat columns." },
            { id: "fr-ecouter", word: "écouter", translation: "to listen", part: "verb", clue: "Lean in to hear." },
        ],
    },
    {
        id: "japanese",
        name: "日本語",
        region: "Hikari Trails",
        description: "Kana fireflies, soothing nature, and expressive verbs.",
        intro: [
            "ようこそ! The Hikari Trails glow with flowing Japanese.",
            "Kana creatures appear in the tall grass when you explore.",
            "Answer with care — each success lights up your LexiLog.",
        ],
        lexicon: [
            { id: "jp-ohayo", word: "おはよう", translation: "good morning", part: "greeting", clue: "Sunrise salute." },
            { id: "jp-konnichiwa", word: "こんにちは", translation: "hello", part: "greeting", clue: "Midday hello." },
            { id: "jp-arigato", word: "ありがとう", translation: "thank you", part: "expression", clue: "Polite bow." },
            { id: "jp-neko", word: "ねこ", translation: "cat", part: "creature", clue: "Soft paws." },
            { id: "jp-mizu", word: "みず", translation: "water", part: "nature", clue: "Flowing and clear." },
            { id: "jp-hon", word: "ほん", translation: "book", part: "object", clue: "Layers of stories." },
            { id: "jp-taberu", word: "たべる", translation: "to eat", part: "verb", clue: "Verb for mealtime." },
            { id: "jp-kiiro", word: "きいろ", translation: "yellow", part: "adjective", clue: "Bright like ginkgo leaves." },
        ],
    },
];

const TOTAL_GLOBAL_WORDS = LANGUAGE_TRACKS.reduce((sum, track) => sum + track.lexicon.length, 0);

function emitTestEvent(type, payload) {
    if (
        typeof window !== "undefined" &&
        window.__LL_TEST__ &&
        typeof window.__LL_TEST__.emit === "function"
    ) {
        try {
            window.__LL_TEST__.emit(type, payload);
        } catch (error) {
            console.warn("Lingua Legends test hook error", error);
        }
    }
}

const kb = kaboom({
    root: document.querySelector("#game-root"),
    width: 240,
    height: 160,
    scale: 4,
    letterbox: true,
    crisp: true,
    background: [18, 46, 26],
    debug: false,
});

kb.setGravity(0);

const {
    add,
    addLevel,
    anchor,
    area,
    camPos,
    camScale,
    color,
    dt,
    fixed,
    go,
    isKeyDown,
    onKeyPress,
    pos,
    rect,
    rgb,
    scene,
    solid,
    sprite,
    text,
    vec2,
    wait,
    width,
    height,
    z,
    outline,
} = kb;

const state = {
    trackId: null,
    playerTile: vec2(8, 7),
    facing: "down",
    level: 1,
    xp: 0,
    encounterCooldown: 0,
    discovered: new Set(),
    captured: new Set(),
    log: [],
};

const NPCS = [
    {
        id: "professor",
        tile: vec2(14, 6),
        facing: "left",
        lines: [
            "Professor Lexica: Words roam wild out here.",
            "Drop into the grass and answer clearly to win their trust.",
            "Your LexiLog records every victory — keep it glowing!",
        ],
    },
];

const hudNodes = {
    track: document.getElementById("hud-track"),
    progress: document.getElementById("hud-progress"),
    level: document.getElementById("hud-level"),
    feed: document.getElementById("hud-feed"),
};

let cleanupSceneBindings = () => {};

const mobileControls = (() => {
    const listeners = new Set();
    const directionState = new Set();

    return {
        on(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        emit(event) {
            if (event.type === "direction") {
                if (event.active) {
                    directionState.add(event.name);
                } else {
                    directionState.delete(event.name);
                }
            }
            listeners.forEach(listener => listener(event));
        },
        isDirectionActive(direction) {
            return directionState.has(direction);
        },
        clear() {
            directionState.clear();
            if (typeof document !== "undefined") {
                document
                    .querySelectorAll(".mobile-controls .is-active")
                    .forEach(element => element.classList.remove("is-active"));
            }
        },
    };
})();

function setupTouchControls() {
    if (typeof document === "undefined") return;
    const container = document.querySelector(".mobile-controls");
    if (!container) return;

    const supportsPointerEvents = typeof window !== "undefined" && "PointerEvent" in window;

    const bindHold = (element, emit) => {
        let pointerId = null;

        if (supportsPointerEvents) {
            const activatePointer = event => {
                if (pointerId !== null) return;
                if (event.pointerType === "mouse" && event.button !== 0) return;
                pointerId = event.pointerId;
                element.classList.add("is-active");
                emit(true);
                if (element.setPointerCapture) {
                    element.setPointerCapture(pointerId);
                }
                event.preventDefault();
            };

            const releasePointer = event => {
                if (pointerId === null) return;
                if (event && event.pointerId !== pointerId) return;
                emit(false);
                element.classList.remove("is-active");
                if (element.hasPointerCapture && element.hasPointerCapture(pointerId)) {
                    element.releasePointerCapture(pointerId);
                }
                pointerId = null;
                if (event) {
                    event.preventDefault();
                }
            };

            element.addEventListener("pointerdown", activatePointer, { passive: false });
            element.addEventListener("pointerup", releasePointer, { passive: false });
            element.addEventListener("pointercancel", releasePointer, { passive: false });
            element.addEventListener("lostpointercapture", releasePointer);
        } else {
            const activateTouch = event => {
                if (pointerId !== null) return;
                const touch = event.changedTouches && event.changedTouches[0];
                if (!touch) return;
                pointerId = touch.identifier;
                element.classList.add("is-active");
                emit(true);
                event.preventDefault();
            };

            const releaseTouch = event => {
                if (pointerId === null) return;
                const touches = event.changedTouches ? Array.from(event.changedTouches) : [];
                const match = touches.find(touch => touch.identifier === pointerId);
                if (!match) return;
                emit(false);
                element.classList.remove("is-active");
                pointerId = null;
                event.preventDefault();
            };

            element.addEventListener("touchstart", activateTouch, { passive: false });
            element.addEventListener("touchend", releaseTouch, { passive: false });
            element.addEventListener("touchcancel", releaseTouch, { passive: false });
        }

        element.addEventListener("contextmenu", event => event.preventDefault());
    };

    container.querySelectorAll("[data-direction]").forEach(element => {
        const direction = element.getAttribute("data-direction");
        if (!direction) return;
        bindHold(element, active => {
            mobileControls.emit({ type: "direction", name: direction, active });
        });
    });

    container.querySelectorAll("[data-action]").forEach(element => {
        const action = element.getAttribute("data-action");
        if (!action) return;
        bindHold(element, active => {
            mobileControls.emit({ type: "action", name: action, active });
        });
    });

    mobileControls.clear();
}

setupTouchControls();
function getActiveTrack() {
    return LANGUAGE_TRACKS.find(track => track.id === state.trackId) || null;
}

function updateHud() {
    const track = getActiveTrack();
    if (hudNodes.track) {
        hudNodes.track.textContent = track
            ? `Track: ${track.name} — ${track.region}`
            : "Track: —";
    }
    if (hudNodes.progress) {
        if (track) {
            const caught = track.lexicon.filter(word => state.captured.has(word.id)).length;
            hudNodes.progress.textContent = `Lexicon: ${caught}/${track.lexicon.length}`;
        } else {
            hudNodes.progress.textContent = `Lexicon: 0/${TOTAL_GLOBAL_WORDS}`;
        }
    }
    if (hudNodes.level) {
        hudNodes.level.textContent = `Rank: ${state.level}`;
    }
    if (hudNodes.feed) {
        hudNodes.feed.innerHTML = state.log
            .slice(0, MAX_HUD_LOG)
            .map(entry => `<p>${entry}</p>`)
            .join("");
    }
}

function logMessage(message) {
    state.log.unshift(message);
    if (state.log.length > MAX_HUD_LOG) {
        state.log.length = MAX_HUD_LOG;
    }
    updateHud();
}

function resetForTrack(track) {
    state.trackId = track.id;
    state.playerTile = vec2(8, 7);
    state.facing = "down";
    state.level = 1;
    state.xp = 0;
    state.encounterCooldown = 2;
    state.discovered.clear();
    state.captured.clear();
    state.log = [];
    logMessage(`Welcome to ${track.region}!`);
    logMessage(track.description);
    updateHud();
    emitTestEvent("track-selected", { trackId: track.id });
}

function randomChoice(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function pickDistractors(list, correct, count) {
    const unique = Array.from(new Set(list.filter(entry => entry !== correct)));
    const shuffled = shuffle(unique);
    const picks = [];
    while (picks.length < count && shuffled.length) {
        const candidate = shuffled.shift();
        if (!picks.includes(candidate) && candidate !== correct) {
            picks.push(candidate);
        }
    }
    return picks;
}

function mapSize() {
    return {
        width: MAP_LAYOUT[0].length,
        height: MAP_LAYOUT.length,
    };
}

function tileInBounds(tile) {
    const { width: w, height: h } = mapSize();
    return tile.x >= 0 && tile.x < w && tile.y >= 0 && tile.y < h;
}

function tileChar(tile) {
    if (!tileInBounds(tile)) return "T";
    return MAP_LAYOUT[tile.y][tile.x];
}

function isPassable(tile) {
    const char = tileChar(tile);
    return char === "G" || char === "P" || char === "F" || char === "S";
}

function tileToWorld(tile) {
    return vec2(tile.x * TILE_SIZE + TILE_SIZE / 2, tile.y * TILE_SIZE + TILE_SIZE / 2);
}

function gainExperience(amount) {
    state.xp += amount;
    const newLevel = Math.floor(state.xp / 80) + 1;
    if (newLevel > state.level) {
        state.level = newLevel;
        logMessage(`Rank up! You reached level ${state.level}.`);
    }
    updateHud();
}

function pickWordForEncounter(track) {
    const unknown = track.lexicon.filter(word => !state.captured.has(word.id));
    const pool = unknown.length ? unknown : track.lexicon;
    return randomChoice(pool);
}

function generateQuestion(word, track) {
    const templates = ["toEnglish", "toForeign"];
    const parts = Array.from(new Set(track.lexicon.map(entry => entry.part))).filter(Boolean);
    if (parts.length >= 3 && word.part) {
        templates.push("category");
    }
    const template = randomChoice(templates);
    if (template === "toForeign") {
        const distractors = pickDistractors(
            track.lexicon.map(entry => entry.word),
            word.word,
            3,
        );
        const answers = shuffle([word.word, ...distractors]);
        return {
            prompt: `How do you say "${word.translation}" in ${track.name}?`,
            answers,
            correct: word.word,
        };
    }
    if (template === "category") {
        const distractors = pickDistractors(parts, word.part, 3);
        const answers = shuffle([word.part, ...distractors]);
        return {
            prompt: `Which category fits "${word.word}" best?`,
            answers,
            correct: word.part,
        };
    }
    const fallbackTranslations = LANGUAGE_TRACKS.flatMap(entry =>
        entry.lexicon.map(item => item.translation),
    );
    const distractors = pickDistractors(fallbackTranslations, word.translation, 3);
    const answers = shuffle([word.translation, ...distractors]);
    return {
        prompt: `What does "${word.word}" mean?`,
        answers,
        correct: word.translation,
    };
}

function createCanvasTexture(widthPx, heightPx, draw) {
    const canvas = document.createElement("canvas");
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    draw(ctx);
    return canvas.toDataURL();
}

function drawGrassTile(ctx) {
    ctx.fillStyle = PALETTE.dark;
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = PALETTE.mid;
    for (let i = 0; i < 12; i++) {
        const x = (i * 3 + 5) % TILE_SIZE;
        const y = ((i * 5) % TILE_SIZE);
        ctx.fillRect(x, y, 2, 5);
    }
    ctx.fillStyle = PALETTE.light;
    for (let i = 0; i < 6; i++) {
        const x = (i * 5 + 1) % TILE_SIZE;
        const y = ((i * 7 + 3) % TILE_SIZE);
        ctx.fillRect(x, y, 1, 3);
    }
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);
}

function drawFlowerTile(ctx) {
    drawGrassTile(ctx);
    ctx.fillStyle = PALETTE.bloom;
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(3 + i * 3, 3 + ((i * 2) % 4), 2, 2);
    }
    ctx.fillStyle = PALETTE.highlight;
    ctx.fillRect(6, 6, 1, 1);
}

function drawPathTile(ctx) {
    ctx.fillStyle = PALETTE.earth;
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "#8d6a4a";
    ctx.fillRect(0, TILE_SIZE / 2 - 2, TILE_SIZE, 4);
    ctx.fillStyle = "#c19b70";
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(2 + i * 5, 3 + i, 3, 1);
        ctx.fillRect(4 + i * 4, 11 - i, 2, 1);
    }
}

function drawWaterTile(ctx) {
    ctx.fillStyle = PALETTE.water;
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "#3d6fb3";
    ctx.fillRect(0, 2, TILE_SIZE, 2);
    ctx.fillRect(0, 10, TILE_SIZE, 2);
    ctx.fillStyle = "#78a9f3";
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(3 + i * 3, 5 + (i % 2), 2, 2);
    }
}

function drawTreeTile(ctx) {
    ctx.fillStyle = PALETTE.dark;
    ctx.fillRect(5, 12, 6, 4);
    ctx.fillStyle = PALETTE.mid;
    ctx.beginPath();
    ctx.arc(8, 6, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PALETTE.light;
    ctx.beginPath();
    ctx.arc(6, 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, 4, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawHouseTile(ctx) {
    ctx.fillStyle = "#c19b70";
    ctx.fillRect(1, 6, 14, 9);
    ctx.fillStyle = "#8d6a4a";
    ctx.beginPath();
    ctx.moveTo(0, 7);
    ctx.lineTo(8, 0);
    ctx.lineTo(16, 7);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f4f7d2";
    ctx.fillRect(5, 8, 6, 4);
    ctx.fillStyle = "#4f3721";
    ctx.fillRect(7, 11, 2, 4);
}

function drawSign(ctx) {
    ctx.fillStyle = "#6f5a3c";
    ctx.fillRect(6, 4, 4, 8);
    ctx.fillStyle = "#d8c4a6";
    ctx.fillRect(2, 0, 12, 6);
    ctx.fillStyle = "#4c3b28";
    ctx.fillRect(3, 2, 10, 2);
}

function drawSparkSheet(ctx) {
    const frames = 4;
    for (let i = 0; i < frames; i++) {
        const offsetX = i * 8;
        ctx.clearRect(offsetX, 0, 8, 8);
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(offsetX, 0, 8, 8);
        ctx.fillStyle = i % 2 === 0 ? PALETTE.highlight : PALETTE.accent;
        ctx.fillRect(offsetX + 3, 1, 2, 6);
        ctx.fillRect(offsetX + 1, 3, 6, 2);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fillRect(offsetX + 3, 3, 2, 2);
    }
}

function drawTrainerSheet(ctx) {
    const directions = ["down", "left", "right", "up"];
    for (let row = 0; row < directions.length; row++) {
        for (let col = 0; col < 2; col++) {
            const ox = col * TILE_SIZE;
            const oy = row * TILE_SIZE;
            ctx.clearRect(ox, oy, TILE_SIZE, TILE_SIZE);

            ctx.fillStyle = "rgba(0,0,0,0.25)";
            ctx.fillRect(ox + 4, oy + 13, 8, 2);

            ctx.fillStyle = "#f4d7a4";
            ctx.fillRect(ox + 5, oy + 2, 6, 5);
            ctx.fillRect(ox + 4, oy + 4, 8, 4);

            ctx.fillStyle = "#2f3a28";
            ctx.fillRect(ox + 5, oy + 1, 6, 2);
            ctx.fillRect(ox + 4, oy + 3, 8, 1);

            ctx.fillStyle = PALETTE.darkest;
            if (directions[row] === "down" || directions[row] === "right") {
                ctx.fillRect(ox + 6, oy + 5, 1, 1);
                ctx.fillRect(ox + 9, oy + 5, 1, 1);
            } else if (directions[row] === "left") {
                ctx.fillRect(ox + 4, oy + 5, 1, 1);
                ctx.fillRect(ox + 7, oy + 5, 1, 1);
            }

            ctx.fillStyle = PALETTE.light;
            ctx.fillRect(ox + 5, oy + 7, 6, 4);

            ctx.fillStyle = PALETTE.mid;
            ctx.fillRect(ox + 4, oy + 7, 2, 4);
            ctx.fillRect(ox + 10, oy + 7, 2, 4);

            ctx.fillStyle = "#1f3d2c";
            const legOffset = col === 0 ? -1 : 1;
            ctx.fillRect(ox + 5 + legOffset, oy + 11, 3, 4);
            ctx.fillRect(ox + 8 - legOffset, oy + 11, 3, 4);

            ctx.fillStyle = "#0f1a10";
            ctx.fillRect(ox + 5 + legOffset, oy + 14, 3, 1);
            ctx.fillRect(ox + 8 - legOffset, oy + 14, 3, 1);
        }
    }
}

function drawMentorSprite(ctx) {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(4, 13, 8, 2);
    ctx.fillStyle = "#fbe7c6";
    ctx.fillRect(5, 2, 6, 5);
    ctx.fillRect(4, 4, 8, 4);
    ctx.fillStyle = "#2d2a4a";
    ctx.fillRect(5, 1, 6, 2);
    ctx.fillRect(5, 4, 6, 1);
    ctx.fillStyle = "#1b2742";
    ctx.fillRect(5, 7, 6, 6);
    ctx.fillStyle = "#243450";
    ctx.fillRect(4, 8, 2, 4);
    ctx.fillRect(10, 8, 2, 4);
    ctx.fillStyle = "#101629";
    ctx.fillRect(5, 12, 2, 3);
    ctx.fillRect(9, 12, 2, 3);
}

function drawPointerSprite(ctx) {
    ctx.fillStyle = PALETTE.highlight;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(6, 0);
    ctx.lineTo(6, 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = PALETTE.mid;
    ctx.fillRect(2, 3, 2, 2);
}

async function initAssets() {
    const textures = [
        ["grass", createCanvasTexture(TILE_SIZE, TILE_SIZE, drawGrassTile)],
        ["flowers", createCanvasTexture(TILE_SIZE, TILE_SIZE, drawFlowerTile)],
        ["path", createCanvasTexture(TILE_SIZE, TILE_SIZE, drawPathTile)],
        ["water", createCanvasTexture(TILE_SIZE, TILE_SIZE, drawWaterTile)],
        ["tree", createCanvasTexture(TILE_SIZE, TILE_SIZE, drawTreeTile)],
        ["house", createCanvasTexture(TILE_SIZE, TILE_SIZE, drawHouseTile)],
        ["sign", createCanvasTexture(TILE_SIZE, TILE_SIZE, drawSign)],
        [
            "spark",
            createCanvasTexture(8 * 4, 8, drawSparkSheet),
            { sliceX: 4, anims: { shimmer: { from: 0, to: 3, speed: 12, loop: true } } },
        ],
        [
            "trainer",
            createCanvasTexture(TILE_SIZE * 2, TILE_SIZE * 4, drawTrainerSheet),
            {
                sliceX: 2,
                sliceY: 4,
                anims: {
                    "idle-down": { from: 0, to: 0 },
                    "walk-down": { from: 0, to: 1, speed: 6, loop: true },
                    "idle-left": { from: 2, to: 2 },
                    "walk-left": { from: 2, to: 3, speed: 6, loop: true },
                    "idle-right": { from: 4, to: 4 },
                    "walk-right": { from: 4, to: 5, speed: 6, loop: true },
                    "idle-up": { from: 6, to: 6 },
                    "walk-up": { from: 6, to: 7, speed: 6, loop: true },
                },
            },
        ],
        ["mentor", createCanvasTexture(TILE_SIZE, TILE_SIZE, drawMentorSprite)],
        ["pointer", createCanvasTexture(6, 8, drawPointerSprite)],
    ];

    await Promise.all(
        textures.map(([name, dataUrl, config]) =>
            config ? kb.loadSprite(name, dataUrl, config) : kb.loadSprite(name, dataUrl),
        ),
    );
}

const directionVectors = {
    up: vec2(0, -1),
    down: vec2(0, 1),
    left: vec2(-1, 0),
    right: vec2(1, 0),
};

const directionPriority = ["up", "down", "left", "right"];

scene("menu", () => {
    cleanupSceneBindings();
    const sceneUnsubs = [];
    const registerMobile = handler => {
        sceneUnsubs.push(mobileControls.on(handler));
    };
    cleanupSceneBindings = () => {
        sceneUnsubs.forEach(unsub => unsub());
        mobileControls.clear();
    };

    camScale(1);
    camPos(width() / 2, height() / 2);

    add([
        rect(width(), height()),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(18, 46, 32),
    ]);

    add([
        text("Lingua Legends GB", { size: 16, align: "center" }),
        pos(width() / 2, 20),
        anchor("top"),
        color(rgb(216, 249, 123)),
    ]);

    add([
        text("Select a language track to begin.", { size: 10, align: "center" }),
        pos(width() / 2, 44),
        anchor("top"),
        color(rgb(148, 184, 148)),
    ]);

    const optionStartY = 70;
    const optionSpacing = 24;
    const optionNodes = LANGUAGE_TRACKS.map((track, index) =>
        add([
            text(`${track.name} — ${track.region}`, { size: 10 }),
            pos(width() / 2 + 8, optionStartY + index * optionSpacing),
            anchor("left"),
            color(rgb(188, 214, 170)),
        ]),
    );

    const pointer = add([
        sprite("pointer"),
        pos(width() / 2 - 12, optionStartY),
        anchor("center"),
        color(rgb(216, 249, 123)),
    ]);

    let selection = 0;

    function refreshSelection() {
        optionNodes.forEach((node, idx) => {
            node.color = idx === selection ? rgb(216, 249, 123) : rgb(148, 184, 148);
        });
        pointer.pos = vec2(width() / 2 - 16, optionStartY + selection * optionSpacing + 4);
    }

    refreshSelection();

    function changeSelection(delta) {
        const max = LANGUAGE_TRACKS.length;
        selection = (selection + delta + max) % max;
        refreshSelection();
    }

    function confirmSelection() {
        const chosen = LANGUAGE_TRACKS[selection];
        resetForTrack(chosen);
        updateHud();
        go("overworld", { intro: true });
    }

    onKeyPress("down", () => changeSelection(1));
    onKeyPress("up", () => changeSelection(-1));
    onKeyPress("enter", confirmSelection);
    onKeyPress("space", confirmSelection);

    registerMobile(event => {
        if (event.type === "direction" && event.active) {
            if (event.name === "down") changeSelection(1);
            if (event.name === "up") changeSelection(-1);
        } else if (event.type === "action" && event.active) {
            if (event.name === "confirm") {
                confirmSelection();
            }
        }
    });
});

scene("battle", ({ word }) => {
    cleanupSceneBindings();
    const sceneUnsubs = [];
    const registerMobile = handler => {
        sceneUnsubs.push(mobileControls.on(handler));
    };
    cleanupSceneBindings = () => {
        sceneUnsubs.forEach(unsub => unsub());
        mobileControls.clear();
    };

    const track = getActiveTrack();
    if (!track) {
        go("menu");
        return;
    }

    camScale(1);
    camPos(width() / 2, height() / 2);

    add([
        rect(width(), height()),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(22, 50, 32),
    ]);

    const banner = add([
        rect(width() - 12, height() - 12),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(18, 40, 24),
        outline(2, rgb(80, 110, 72)),
    ]);

    const encounterWord = word || pickWordForEncounter(track);
    state.discovered.add(encounterWord.id);

    const question = generateQuestion(encounterWord, track);

    add([
        text(encounterWord.word, { size: 18, align: "center" }),
        pos(width() / 2, 20),
        anchor("top"),
        color(rgb(216, 249, 123)),
    ]);

    add([
        text(encounterWord.clue, { size: 10, width: width() - 24, align: "center" }),
        pos(width() / 2, 48),
        anchor("top"),
        color(rgb(148, 184, 148)),
    ]);

    add([
        text(question.prompt, { size: 12, width: width() - 24, align: "center" }),
        pos(width() / 2, 68),
        anchor("top"),
        color(rgb(240, 252, 226)),
    ]);

    const optionStartY = 94;
    const optionSpacing = 18;
    const optionNodes = question.answers.map((answer, index) =>
        add([
            text("", { size: 12 }),
            pos(width() / 2, optionStartY + index * optionSpacing),
            anchor("center"),
            color(rgb(180, 206, 168)),
        ]),
    );

    const instruction = add([
        text("Enter/Space to answer • Esc to retreat", { size: 8, align: "center" }),
        pos(width() / 2, height() - 18),
        anchor("center"),
        color(rgb(120, 150, 118)),
    ]);

    const resultLabel = add([
        text("", { size: 11, width: width() - 20, align: "center" }),
        pos(width() / 2, height() - 44),
        anchor("center"),
        color(rgb(216, 249, 123)),
    ]);

    const spark = add([
        sprite("spark", { anim: "shimmer" }),
        pos(width() / 2, 58),
        anchor("center"),
        z(-1),
    ]);
    spark.scale = 1.8;

    let selection = 0;
    let locked = false;

    function moveSelection(delta) {
        if (locked) return;
        selection = (selection + delta + question.answers.length) % question.answers.length;
        refreshOptions();
    }

    function refreshOptions() {
        optionNodes.forEach((node, idx) => {
            node.text = `${idx === selection ? "▶" : " "} ${question.answers[idx]}`;
            node.color = idx === selection ? rgb(216, 249, 123) : rgb(160, 190, 150);
        });
    }

    refreshOptions();

    function resolveAnswer(correct) {
        locked = true;
        if (correct) {
            state.captured.add(encounterWord.id);
            gainExperience(35);
            resultLabel.text = `Captured! "${encounterWord.word}" = "${encounterWord.translation}".`;
            logMessage(`Captured ${encounterWord.word} = ${encounterWord.translation}.`);
        } else {
            resultLabel.text = `Missed! "${encounterWord.word}" means "${encounterWord.translation}".`;
            logMessage(`Missed ${encounterWord.word}. Try again soon.`);
        }
        updateHud();
        wait(1.4, () => go("overworld", { resume: true }));
    }

    onKeyPress("down", () => moveSelection(1));
    onKeyPress("up", () => moveSelection(-1));

    function submit() {
        if (locked) return;
        const answer = question.answers[selection];
        const isCorrect = answer === question.correct;
        resolveAnswer(isCorrect);
    }

    onKeyPress("enter", submit);
    onKeyPress("space", submit);

    function retreat() {
        if (locked) return;
        locked = true;
        logMessage("You retreated to rethink your strategy.");
        wait(0.6, () => go("overworld", { resume: true }));
    }

    onKeyPress("escape", retreat);

    registerMobile(event => {
        if (event.type === "direction" && event.active) {
            if (event.name === "down") moveSelection(1);
            if (event.name === "up") moveSelection(-1);
        } else if (event.type === "action" && event.active) {
            if (event.name === "confirm") {
                submit();
            } else if (event.name === "back") {
                retreat();
            }
        }
    });
});

scene("overworld", ({ intro = false } = {}) => {
    cleanupSceneBindings();
    const sceneUnsubs = [];
    const registerMobile = handler => {
        sceneUnsubs.push(mobileControls.on(handler));
    };
    cleanupSceneBindings = () => {
        sceneUnsubs.forEach(unsub => unsub());
        mobileControls.clear();
    };

    const track = getActiveTrack();
    if (!track) {
        go("menu");
        return;
    }

    camScale(2.4);

    const level = addLevel(
        MAP_LAYOUT,
        {
            T: () => [
                sprite("tree"),
                anchor("topleft"),
                area({ width: 14, height: 14, offset: vec2(1, 2) }),
                solid(),
                z(5),
            ],
            G: () => [sprite("grass"), anchor("topleft"), z(-5)],
            F: () => [sprite("flowers"), anchor("topleft"), z(-5)],
            P: () => [sprite("path"), anchor("topleft"), z(-6)],
            S: () => [sprite("path"), anchor("topleft"), z(-6)],
            W: () => [sprite("water"), anchor("topleft"), area(), solid(), z(4)],
            C: () => [sprite("house"), anchor("topleft"), area({ width: 16, height: 14, offset: vec2(0, 2) }), solid(), z(4)],
        },
        {
            tileWidth: TILE_SIZE,
            tileHeight: TILE_SIZE,
        },
    );

    const signs = [];
    SIGN_TEXT.forEach((lines, key) => {
        const [xStr, yStr] = key.split(",");
        const tile = vec2(Number(xStr), Number(yStr));
        const entity = add([
            sprite("sign"),
            anchor("center"),
            pos(tileToWorld(tile)),
            area({ width: 12, height: 12, offset: vec2(-6, -6) }),
            z(6),
            { tile, lines },
        ]);
        signs.push(entity);
    });

    const npcEntities = NPCS.map(descriptor => {
        const entity = add([
            sprite("mentor"),
            anchor("center"),
            pos(tileToWorld(descriptor.tile)),
            area({ width: 12, height: 14, offset: vec2(-6, -7) }),
            z(7),
            { data: descriptor },
        ]);
        return entity;
    });

    const player = add([
        sprite("trainer", { anim: `idle-${state.facing}` }),
        anchor("center"),
        pos(tileToWorld(state.playerTile)),
        area({ width: 12, height: 12, offset: vec2(-6, -8) }),
        z(10),
        {
            tile: state.playerTile.clone(),
            targetTile: state.playerTile.clone(),
            targetPos: tileToWorld(state.playerTile),
            moving: false,
            facing: state.facing,
        },
    ]);

    camPos(player.pos);

    let dialogue = null;

    function startDialogue(lines, onComplete = () => {}) {
        const queue = Array.isArray(lines) ? [...lines] : [String(lines)];
        if (!queue.length) return;
        const originalLines = queue.slice();

        const panel = add([
            rect(width() - 12, 52),
            pos(width() / 2, height() - 34),
            anchor("center"),
            color(18, 40, 24),
            outline(2, rgb(70, 100, 68)),
            fixed(),
            z(100),
        ]);

        const label = add([
            text("", { size: 11, width: width() - 28 }),
            pos(width() / 2, height() - 36),
            anchor("center"),
            color(rgb(216, 249, 123)),
            fixed(),
            z(101),
        ]);

        const dialogueState = {
            panel,
            label,
            queue,
            onComplete,
            advance() {
                if (!this.queue.length) {
                    this.panel.destroy();
                    this.label.destroy();
                    dialogue = null;
                    this.onComplete();
                    emitTestEvent("dialogue-closed", {});
                    return;
                }
                this.label.text = this.queue.shift();
                emitTestEvent("dialogue-line", { text: this.label.text });
            },
        };

        dialogue = dialogueState;
        emitTestEvent("dialogue-open", { lines: originalLines });
        dialogue.advance();
    }

    function openLexilog() {
        if (dialogue) return;
        const track = getActiveTrack();
        if (!track) return;
        const capturedWords = track.lexicon.filter(entry => state.captured.has(entry.id));
        if (!capturedWords.length) {
            startDialogue([
                "LexiLog is empty for this track.",
                "Capture words by answering correctly in encounters.",
            ]);
            return;
        }
        const lines = ["LexiLog Entries:"];
        capturedWords.slice(0, 5).forEach(entry => {
            lines.push(`${entry.word.toUpperCase()} = ${entry.translation}`);
        });
        if (capturedWords.length > 5) {
            lines.push(`...and ${capturedWords.length - 5} more waiting for review.`);
        } else {
            lines.push("Keep exploring to expand your LexiLog!");
        }
        startDialogue(lines);
    }

    function setFacing(direction) {
        player.facing = direction;
        state.facing = direction;
        if (!player.moving) {
            player.play(`idle-${direction}`);
        } else {
            player.play(`walk-${direction}`);
        }
    }

    function handleTileArrival(tile) {
        state.playerTile = tile.clone();
        const char = tileChar(tile);
        if (state.encounterCooldown > 0) {
            state.encounterCooldown -= 1;
        }
        if ((char === "G" || char === "F") && state.encounterCooldown <= 0) {
            const baseRate = char === "F" ? 0.28 : 0.16;
            const levelBonus = (state.level - 1) * 0.015;
            if (Math.random() < baseRate + levelBonus) {
                state.encounterCooldown = 3;
                const encounterWord = pickWordForEncounter(track);
                const spark = add([
                    sprite("spark", { anim: "shimmer" }),
                    pos(player.pos.x, player.pos.y + 6),
                    anchor("center"),
                    z(30),
                ]);
                spark.scale = 1.5;
                wait(0.4, () => spark.destroy());
                wait(0.2, () => go("battle", { word: encounterWord }));
            }
        }
    }

    function attemptMove(direction) {
        if (dialogue || player.moving) return;
        setFacing(direction);
        const offset = directionVectors[direction];
        const targetTile = player.tile.add(offset);
        if (!tileInBounds(targetTile) || !isPassable(targetTile)) {
            player.play(`idle-${direction}`);
            return;
        }
        player.moving = true;
        player.targetTile = targetTile;
        player.targetPos = tileToWorld(targetTile);
        player.play(`walk-${direction}`);
    }

    player.onUpdate(() => {
        if (player.moving) {
            const diff = player.targetPos.sub(player.pos);
            const distance = diff.len();
            const step = MOVE_SPEED * dt();
            if (distance <= step) {
                player.pos = player.targetPos;
                player.tile = player.targetTile;
                player.moving = false;
                player.play(`idle-${player.facing}`);
                handleTileArrival(player.tile);
            } else {
                player.move(diff.unit().scale(step));
            }
        } else if (!dialogue) {
            for (const direction of directionPriority) {
                if (isKeyDown(direction) || mobileControls.isDirectionActive(direction)) {
                    attemptMove(direction);
                    break;
                }
            }
        }
        camPos(player.pos);
    });

    function interact() {
        if (dialogue) {
            dialogue.advance();
            return;
        }
        const direction = player.facing;
        const offset = directionVectors[direction];
        const frontTile = player.tile.add(offset);

        const sign = signs.find(entry => entry.tile.x === frontTile.x && entry.tile.y === frontTile.y);
        if (sign) {
            startDialogue(sign.lines);
            return;
        }

        const npc = npcEntities.find(
            entry => entry.data.tile.x === frontTile.x && entry.data.tile.y === frontTile.y,
        );
        if (npc) {
            const lines = npc.data.lines;
            startDialogue(lines);
            return;
        }

        const char = tileChar(frontTile);
        if (char === "C") {
            startDialogue([
                "Language Lab: rest here in future builds to heal and review.",
                "For now, keep exploring the grove outside!",
            ]);
        }
    }

    onKeyPress("space", interact);
    onKeyPress("enter", interact);
    onKeyPress("l", openLexilog);

    registerMobile(event => {
        if (event.type === "action" && event.active) {
            if (event.name === "confirm") {
                interact();
            } else if (event.name === "lexilog") {
                openLexilog();
            } else if (event.name === "back" && dialogue) {
                dialogue.advance();
            }
        }
    });

    if (intro) {
        startDialogue(track.intro);
    }
});

async function bootstrap() {
    await initAssets();
    updateHud();
    go("menu");
}

bootstrap().catch(error => {
    console.error("Failed to start Lingua Legends GB:", error);
});
