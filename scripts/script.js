//get all dom element
const controller = document.querySelector(".fa-gamepad");
const xMark = document.querySelector(".fa-xmark");
const quaver = document.querySelector(".fa-music");
const settingsIcon = document.querySelector(".fa-gear");
const settings = document.querySelector(".settings");
let userTonality = document.getElementById("tonality");
let userScale = document.getElementById("scale");

//get all notes by # or b depending on context
const sharpNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const flatNotes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

//create some usefull variable for later
let win = false;
let noteToFind;
let randomScale;
let userTonalityChoice = userTonality.value;
let userScaleChoice = userScale.value;
let sharpOrFlat;

//numbers of semitones in scales
const diatonicMajorScale = [0, 2, 4, 5, 7, 9, 11];
const diatonicMinorScale = [0, 2, 3, 5, 7, 8, 10];
const minorHarmonicScale = [0, 2, 3, 5, 7, 8, 11];
const minorMelodicScale = [0, 2, 3, 5, 7, 9, 11];
const majorPenta = [0, 2, 4, 7, 9];
const minorPenta = [0, 3, 5, 7, 10];

//create an object to fill notes on it
const strings = {
    six: [],
    five: [],
    four: [],
    three: [],
    two: [],
    one: []
};

let chosenScale = diatonicMajorScale;

//basic evenements
controller.addEventListener("click", launchGame);
xMark.addEventListener("click", closeSettings);
settingsIcon.addEventListener("click", openSettings);
userTonality.addEventListener("change", () => {
    userTonalityChoice = userTonality.value;
});
userScale.addEventListener("change", () => {
    switch (userScale.value) {
        case "major": chosenScale = diatonicMajorScale;
            break;
        case "minor": chosenScale = diatonicMinorScale;
            break;
        case "harmonic-minor": chosenScale = minorHarmonicScale;
            break;
        case "melodic-minor": chosenScale = minorMelodicScale;
            break;
        case "major-penta": chosenScale = majorPenta;
            break;
        case "minor-penta": chosenScale = minorPenta;
        default: console.log("pas encore fait");
    }
})

quaver.addEventListener("click", () => {

    if (userTonalityChoice === "C" || userTonalityChoice === "D" || userTonalityChoice === "E" || userTonalityChoice === "G" || userTonalityChoice === "A" || userTonalityChoice === "B") {
        sharpOrFlat = sharpNotes;
    } else {
        sharpOrFlat = flatNotes;
    }
    console.log("choix de tona : " + userTonalityChoice);
    console.log("gamme chroma " + sharpOrFlat);
    console.log("choix de gamme : " + chosenScale);

    const question = document.querySelector(".game");
    question.style.opacity = "0";


    showScale(userTonalityChoice, sharpOrFlat, chosenScale);
})

function closeSettings() {
    settings.classList.remove("opened");
}

function openSettings() {
    settings.classList.add("opened");
}

//fonction pour créer la gamme (test)

function showScale(tonic, chromatic, scale) {
    clearString();
    const resultText = document.querySelector(".result-text");
    resultText.style.opacity = "0";

    fullString(sharpOrFlat);
    const notes = document.querySelectorAll(".note");

    let fundamentalIndex = chromatic.findIndex((note) => note === tonic);
    let index;
    let notesScale = []

    for (let i = 0; i < scale.length; i++) {
        index = (fundamentalIndex + scale[i]) % chromatic.length
        notesScale.push(chromatic[index]);
    }
    console.log(notesScale);
    notes.forEach((note) => {
        note.removeEventListener("click", checkResponse)
        note.style.cursor = "default";
        if (notesScale.includes(note.textContent)) {
            note.classList.add("reveal");
        }
    })
}

//for the game, switch between # or b
function getRandomScale() {
    randomScale = Math.random() >= 0.5 ? sharpNotes : flatNotes;
}

//create all div wich contains notes names along the strings
function fullString(scale) {
    const fretZeros = {
        six: "E",
        five: "A",
        four: "D",
        three: "G",
        two: "B",
        one: "E"
    };

    const stringNames = Object.keys(strings);

    for (let stringName of stringNames) {
        let fretZeroIndex = scale.findIndex((note) => note === fretZeros[stringName]);

        for (let i = 0; i < 23; i++) {
            strings[stringName].push(scale[fretZeroIndex]);

            const stringElement = document.querySelector(`.${stringName.toLowerCase()}`);
            if (stringElement) {
                const note = document.createElement("div");
                note.textContent = scale[fretZeroIndex];
                note.classList.add("note");
                note.classList.add(`fret-${i}`);
                stringElement.appendChild(note);
            }

            fretZeroIndex = (fretZeroIndex + 1) % scale.length;
        }
    }
}

//empty notes on strings
function clearString() {
    const strings = document.querySelectorAll(".string");

    strings.forEach((string) => {
        string.innerHTML = "";
    })
}

//get random note for the game
function rollNote(scale) {
    const span = document.querySelector(".note-to-find");
    if (span) {
        const randomIndex = Math.floor(Math.random() * scale.length);
        noteToFind = scale[randomIndex];
        span.textContent = noteToFind;
    }
    return noteToFind;
}

//reveal note on the neck on click
function noteReveal() {
    const notes = document.querySelectorAll(".note");

    notes.forEach((note) => {
        note.addEventListener("click", checkResponse);
    });
}

//check if it's win or lose during the game
function checkResponse(e) {
    e.target.classList.add("reveal");
    if (e.target.innerText === noteToFind) {
        win = true;
        e.target.style.backgroundColor = "green";
    } else {
        win = false;
        e.target.style.backgroundColor = "red";
    }
    result(win);
}

//show result of the game
function result(win) {
    const replayBtn = document.querySelector("button");
    const resultText = document.querySelector(".result-text");
    const notes = document.querySelectorAll(".note");

    notes.forEach((note) => {
        note.removeEventListener("click", checkResponse);
        note.style.cursor = "default";
    });
    if (win) {
        resultText.textContent = "Bravo vous avez trouvé !";
        resultText.style.color = "green";
    } else {
        resultText.textContent = "Et non ! Vous vous êtes trompé !";
        resultText.style.color = "red";
    }
    resultText.style.opacity = "1";
    replayBtn.style.opacity = "1";
}

//replay function
function replay() {
    const replayBtn = document.querySelector("button");

    replayBtn.addEventListener("click", launchGame);
}

//game function
function launchGame() {
    clearString();

    const question = document.querySelector(".game");
    const replayBtn = document.querySelector("button");

    question.style.opacity = "1";

    const notes = document.querySelectorAll(".note");
    notes.forEach((note) => {
        note.classList.remove("reveal");
        note.style.backgroundColor = "";

    });
    replayBtn.style.opacity = "0"

    const resultText = document.querySelector(".result-text");
    resultText.textContent = "";
    resultText.style.color = "";
    getRandomScale();
    fullString(randomScale);
    rollNote(randomScale);
    noteReveal();
    replay();
}



