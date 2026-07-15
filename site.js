// --- GAME DATA ---
const pronunciationLevels = [
    ["apple", "water", "hello", "book"],
    ["mountain", "bottle", "chicken", "purple"],
    ["temperature", "comfortable", "vegetable"],
    ["hippopotamus", "chrysanthemum", "specific"]
];

const spellingTiers = [
    { name: "Easy", data: [{q: "cat", a: "cat"}, {q: "dog", a: "dog"}, {q: "hat", a: "hat"}], transition: "Ok done, on easy level, now on the medium." },
    { name: "Medium", data: [{q: "apple", a: "apple"}, {q: "water", a: "water"}, {q: "train", a: "train"}], transition: "Ok done, on medium level, now on medium 2." },
    { name: "Medium 2", data: [{q: "science", a: "science"}, {q: "journey", a: "journey"}, {q: "balance", a: "balance"}], transition: "Ok done, on medium 2 level, now on hard." },
    { name: "Hard", data: [{q: "comfortable", a: "comfortable"}, {q: "vegetable", a: "vegetable"}, {q: "beautiful", a: "beautiful"}], transition: "Ok done, on hard level, now on impossible." },
    { name: "Impossible", data: [{q: "hippopotamus", a: "hippopotamus"}, {q: "unbelievable", a: "unbelievable"}], transition: "Ok done, on impossible level, now on bot." },
    { name: "Bot", data: [{q: "synchronization", a: "synchronization"}, {q: "classification", a: "classification"}], transition: "Ok done, on bot level, now on superhuman." },
    { name: "Superhuman", data: [{q: "telecommunications", a: "telecommunications"}, {q: "misrepresentation", a: "misrepresentation"}], transition: "Ok done, on superhuman level, now on Albert Einstein." },
    { name: "Albert Einstein", data: [{q: "pneumonoultramicroscopicsilicovolcanoconiosis", a: "pneumonoultramicroscopicsilicovolcanoconiosis"}], transition: "Unbelievable! You completed every tier and are officially smarter than Albert Einstein!" }
];

const mathTiers = [
    { name: "Easy", data: [{q: "What is 5 plus 5?", a: "10"}, {q: "What is 10 minus 3?", a: "7"}, {q: "2 plus 8", a: "10"}], transition: "Ok done, on easy level, now on the medium." },
    { name: "Medium", data: [{q: "What is 15 plus 12?", a: "27"}, {q: "20 minus 9", a: "11"}, {q: "3 times 4", a: "12"}], transition: "Ok done, on medium level, now on medium 2." },
    { name: "Medium 2", data: [{q: "5 times 6", a: "30"}, {q: "40 divided by 2", a: "20"}, {q: "8 times 4", a: "32"}], transition: "Ok done, on medium 2 level, now on hard." },
    { name: "Hard", data: [{q: "12 times 12", a: "144"}, {q: "100 divided by 4", a: "25"}, {q: "15 times 3", a: "45"}], transition: "Ok done, on hard level, now on impossible." },
    { name: "Impossible", data: [{q: "13 times 14", a: "182"}, {q: "225 divided by 15", a: "15"}], transition: "Ok done, on impossible level, now on bot." },
    { name: "Bot", data: [{q: "2 to the power of 3", a: "8"}, {q: "Square root of 81", a: "9"}], transition: "Ok done, on bot level, now on superhuman." },
    { name: "Superhuman", data: [{q: "25 times 24", a: "600"}, {q: "Square root of 144", a: "12"}], transition: "Ok done, on superhuman level, now on Albert Einstein." },
    { name: "Albert Einstein", data: [{q: "123 times 45", a: "5535"}], transition: "Unbelievable! You completed every tier and are officially smarter than Albert Einstein!" }
];

const animalTiers = [
    { name: "Easy", data: [{q: "Meow", a: "cat"}, {q: "Woof woof", a: "dog"}, {q: "Moo", a: "cow"}], transition: "Ok done, on easy level, now on the medium." },
    { name: "Medium", data: [{q: "Oink oink", a: "pig"}, {q: "Baa baa", a: "sheep"}, {q: "Quack quack", a: "duck"}], transition: "Ok done, on medium level, now on medium 2." },
    { name: "Medium 2", data: [{q: "Cluck cluck", a: "chicken"}, {q: "Ribbit", a: "frog"}, {q: "Hiss", a: "snake"}], transition: "Ok done, on medium 2 level, now on hard." },
    { name: "Hard", data: [{q: "Roar", a: "lion"}, {q: "Howl", a: "wolf"}, {q: "Neigh", a: "horse"}], transition: "Ok done, on hard level, now on impossible." },
    { name: "Impossible", data: [{q: "Hoo hoo", a: "owl"}, {q: "Squeak", a: "mouse"}], transition: "Ok done, on impossible level, now on bot." },
    { name: "Bot", data: [{q: "Trumpet", a: "elephant"}, {q: "Buzz buzz", a: "bee"}], transition: "Ok done, on bot level, now on superhuman." },
    { name: "Superhuman", data: [{q: "Gobble gobble", a: "turkey"}, {q: "Chirp chirp", a: "cricket"}], transition: "Ok done, on superhuman level, now on Albert Einstein." },
    { name: "Albert Einstein", data: [{q: "Ooh ooh ah ah", a: "monkey"}], transition: "Unbelievable! You completed every tier and are officially smarter than Albert Einstein!" }
];

let currentMode = ""; 
let currentLevel = 0; // For pronunciation
let currentTierIndex = 0; // For spelling, math, animal
let currentQuestionIndex = 0;
let currentTargetAnswer = "";
let currentVoicePrompt = "";
let wordStartTime = 0; // Timer for Speed Per Word (SPW)

// --- WEB SPEECH API SETUP ---
const synth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// --- UI ELEMENTS ---
const mainMenu = document.getElementById('main-menu');
const gameUI = document.getElementById('game-ui');
const pronunciationUI = document.getElementById('pronunciation-ui');
const typingUI = document.getElementById('typing-ui');
const levelDisplay = document.getElementById('level-display');
const statusText = document.getElementById('status-text');
const spwDisplay = document.getElementById('spw-display');

// Pronunciation UI
const wordDisplay = document.getElementById('word-display');
const speakBtn = document.getElementById('speak-btn');
const listeningIndicator = document.getElementById('listening-indicator');

// Typing UI
const textInput = document.getElementById('text-input');
const submitBtn = document.getElementById('submit-btn');
const repeatBtn = document.getElementById('repeat-btn');
const slowBtn = document.getElementById('slow-btn');
const spellOutBtn = document.getElementById('spell-out-btn');
const typingPromptDisplay = document.getElementById('typing-prompt');

textInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter" && !submitBtn.disabled) {
        event.preventDefault();
        checkAnswer();
    }
});

// --- HELPER FUNCTIONS ---

function speak(text, callback, customRate = 0.85) {
    synth.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = customRate; 
    utterance.onend = () => { if (callback) callback(); };
    synth.speak(utterance);
}

function lockControls() {
    textInput.disabled = true;
    submitBtn.disabled = true;
    repeatBtn.disabled = true;
    slowBtn.disabled = true;
    spellOutBtn.disabled = true;
}

function unlockControls() {
    textInput.disabled = false;
    submitBtn.disabled = false;
    repeatBtn.disabled = false;
    
    // Only show/enable slow and spell-out buttons if it's the Spelling mode
    if (currentMode === 'spelling') {
        slowBtn.style.display = 'inline-block';
        spellOutBtn.style.display = 'inline-block';
        slowBtn.disabled = false;
        spellOutBtn.disabled = false;
    } else {
        slowBtn.style.display = 'none';
        spellOutBtn.style.display = 'none';
    }
    
    textInput.focus();
}

function returnToMenu() {
    synth.cancel();
    gameUI.style.display = "none";
    mainMenu.style.display = "block";
}

// --- CORE GAME LOGIC ---

function startGame(mode) {
    currentMode = mode;
    currentLevel = 0;
    currentTierIndex = 0;
    currentQuestionIndex = 0;
    
    mainMenu.style.display = "none";
    gameUI.style.display = "block";
    
    if (mode === 'pronunciation') {
        pronunciationUI.style.display = "block";
        typingUI.style.display = "none";
    } else {
        pronunciationUI.style.display = "none";
        typingUI.style.display = "block";
        
        // Custom prompts based on game mode
        if (mode === 'math') typingPromptDisplay.innerText = "🔢";
        else if (mode === 'animal') typingPromptDisplay.innerText = "🐾";
        else typingPromptDisplay.innerText = "❓";
    }
    loadNextQuestion();
}

function getActiveTiers() {
    if (currentMode === 'math') return mathTiers;
    if (currentMode === 'animal') return animalTiers;
    return spellingTiers;
}

function loadNextQuestion() {
    lockControls();
    speakBtn.disabled = true;
    textInput.value = ""; 
    spwDisplay.innerText = "";
    statusText.innerText = "Wait for AI...";

    if (currentMode === 'pronunciation') {
        levelDisplay.innerText = `Level ${currentLevel + 1}`;
        if (currentLevel >= pronunciationLevels.length) {
            statusText.innerText = "You beat all pronunciation levels!";
            wordDisplay.innerText = "🏆";
            speak("Congratulations! You are a pronunciation master!", returnToMenu);
            return;
        }

        const levelWords = pronunciationLevels[currentLevel];
        currentTargetAnswer = levelWords[Math.floor(Math.random() * levelWords.length)];
        wordDisplay.innerText = currentTargetAnswer;
        speak(`Pronounce it. ${currentTargetAnswer}`, () => {
            statusText.innerText = "Now it's your turn!";
            speakBtn.disabled = false;
        });

    } else {
        const activeTiers = getActiveTiers();

        if (currentTierIndex >= activeTiers.length) {
            statusText.innerText = "Congratulations! You beat Albert Einstein!";
            speak("You beat all the tiers! You are officially a genius!", returnToMenu);
            return;
        }

        const activeTier = activeTiers[currentTierIndex];
        levelDisplay.innerText = `${activeTier.name} - Q ${currentQuestionIndex + 1}/${activeTier.data.length}`;
        
        const questionData = activeTier.data[currentQuestionIndex];
        currentVoicePrompt = questionData.q;
        currentTargetAnswer = questionData.a;

        let instruction = "Spell the word.";
        if (currentMode === 'math') instruction = "Solve this.";
        if (currentMode === 'animal') instruction = "What animal makes this sound?";

        speak(`${instruction} ${currentVoicePrompt}`, () => {
            statusText.innerText = "Type your answer and click Submit.";
            unlockControls();
            wordStartTime = Date.now(); // Start the SPW timer
        });
    }
}

// --- TYPING GAME FUNCTIONS (Spelling, Math, Animal) ---

function checkAnswer() {
    const userTyped = textInput.value.toLowerCase().trim();
    
    if (userTyped === currentTargetAnswer.toLowerCase()) {
        lockControls();
        
        // Calculate Speed Per Word (SPW) - Total time taken
        const timeTakenInSeconds = ((Date.now() - wordStartTime) / 1000).toFixed(2);
        spwDisplay.innerText = `⏱️ Total Time: ${timeTakenInSeconds} seconds!`;
        statusText.innerText = "Perfect!";

        const activeTiers = getActiveTiers();
        const activeTier = activeTiers[currentTierIndex];
        currentQuestionIndex++;

        if (currentQuestionIndex >= activeTier.data.length) {
            currentTierIndex++;
            currentQuestionIndex = 0;
            speak(activeTier.transition, loadNextQuestion);
        } else {
            speak("Ok, let's move on.", loadNextQuestion);
        }
    } else {
        lockControls();
        statusText.innerText = "Incorrect. Try again!";
        textInput.value = ""; 
        
        speak("Try again.", () => {
            statusText.innerText = "Type your answer and click Submit.";
            unlockControls();
            wordStartTime = Date.now(); // Reset timer for the retry
        });
    }
}

function repeatPrompt() {
    lockControls();
    speak(currentVoicePrompt, unlockControls, 0.85);
}

function hearSlowly() {
    lockControls();
    speak(currentVoicePrompt, unlockControls, 0.4);
}

function spellOutWord() {
    lockControls();
    const letterSpelling = currentVoicePrompt.toUpperCase().split('').join('. ');
    speak(letterSpelling, unlockControls, 0.6);
}

// --- PRONUNCIATION FUNCTIONS ---

function startListening() {
    speakBtn.disabled = true;
    statusText.innerText = "";
    listeningIndicator.style.display = "block";
    try { recognition.start(); } catch(e) {}
}

recognition.onresult = (event) => {
    const userSpoke = event.results[0][0].transcript.toLowerCase().replace(/[^a-z]/g, "");
    const targetWord = currentTargetAnswer.toLowerCase().replace(/[^a-z]/g, "");

    if (userSpoke === targetWord) {
        statusText.innerText = "Perfect!";
        speak("Ok, let's move on.", () => {
            currentLevel++;
            loadNextQuestion();
        });
    } else {
        statusText.innerText = `You said: "${event.results[0][0].transcript}".`;
        speak("Try again.", () => {
            statusText.innerText = "Click to speak when ready.";
            speakBtn.disabled = false;
        });
    }
};

recognition.onend = () => {
    listeningIndicator.style.display = "none";
    if (speakBtn.disabled && statusText.innerText === "" && currentMode === 'pronunciation') {
         speakBtn.disabled = false;
         statusText.innerText = "Click to speak.";
    }
};