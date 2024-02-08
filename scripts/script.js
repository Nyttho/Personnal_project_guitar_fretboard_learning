const controller = document.querySelector(".fa-gamepad");
const sharpNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const flatNotes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
let win = false;
let noteToFind;
let randomScale;
//numbers of semitones in scales
const diatonicMajorScale = [0, 2, 4, 5, 7, 9, 11];
const diatonicMinorScale = [0, 2, 3, 5, 7, 8, 10];
const minorHarmonicScale = [0, 2, 3, 5, 7, 8, 11];
const minorMelodicScale = [0, 2, 3, 5, 7, 9, 11];

const MajorPenta = [0, 2, 4, 7, 9];
const MinorPenta = [0, 3, 5, 7, 10];


const strings = {
    six: [],
    five: [],
    four: [],
    three: [],
    two: [],
    one: []
};

controller.addEventListener("click", launchGame);


// showScale("Bb", flatNotes, diatonicMajorScale);

//fonction pour créer la gamme (test)

function showScale(tonic, chromatic, scale) {
    randomScale = chromatic;
    fullString(randomScale);
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
        if (notesScale.includes(note.textContent)) {
            //changer pour ajouter une class pour que ce soit moins bourrin
            note.style.opacity = "1";
            note.style.backgroundColor = "blue";
            note.style.height = "30px";
            note.style.width = "30px";
        }
    })
}


function getRandomScale() {
    randomScale = Math.random() >= 0.5 ? sharpNotes : flatNotes;
}

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

function rollNote(scale) {
    const span = document.querySelector(".note-to-find");
    if (span) {
        const randomIndex = Math.floor(Math.random() * scale.length);
        noteToFind = scale[randomIndex];
        span.textContent = noteToFind;
    }
    return noteToFind;
}

function noteReveal() {
    const notes = document.querySelectorAll(".note");

    notes.forEach((note) => {
        note.addEventListener("click", checkResponse);
    });
}

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

function result(win) {
    const replayBtn = document.querySelector("button");
    const resultText = document.querySelector(".result-text");
    const notes = document.querySelectorAll(".note");

    notes.forEach((note) => {
        note.removeEventListener("click", checkResponse);
    });
    if (win) {
        resultText.textContent = "Bravo vous avez trouvé !";
        resultText.style.color = "green";
    } else {
        resultText.textContent = "Et non ! Vous vous êtes trompé !";
        resultText.style.color = "red";
    }
    replayBtn.style.opacity = "1"
}

function replay() {
    const replayBtn = document.querySelector("button");

    replayBtn.addEventListener("click", launchGame);
}

function launchGame() {
    const question = document.querySelector(".game");
    const replayBtn = document.querySelector("button");

    question.style.opacity = "1";

    const notes = document.querySelectorAll(".note");
    notes.forEach((note) => {
        note.classList.remove("reveal");
        note.style.backgroundColor = ""; // Réinitialiser la couleur de fond
    });
    replayBtn.style.opacity = "0"

    const resultText = document.querySelector(".result-text");
    resultText.textContent = ""; // Réinitialiser le texte du résultat
    resultText.style.color = ""; // Réinitialiser la couleur du texte
    getRandomScale();
    fullString(randomScale);
    rollNote(randomScale);
    noteReveal();
    replay();
}



