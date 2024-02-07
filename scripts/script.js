const sharpNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const flatNotes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
let win = false;
let noteToFind;
let randomScale;

function getRandomScale() {
    randomScale = Math.random() >= 0.5 ? sharpNotes : flatNotes;
}


const strings = {
    low: [],
    A: [],
    D: [],
    G: [],
    B: [],
    high: []
};

function fullString(scale) {
    const fretZeros = {
        low: "E",
        A: "A",
        D: "D",
        G: "G",
        B: "B",
        high: "E"
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
    if (win) {
        resultText.textContent = "Bravo vous avez trouvé";
        resultText.style.color = "green";
    } else {
        resultText.textContent = "Et non ! Vous vous êtes trompé !";
        resultText.style.color = "red";
    }
    replayBtn.style.display = "block"
}

function replay() {
    const replayBtn = document.querySelector("button");

    replayBtn.addEventListener("click", launchGame);
}

function launchGame() {
    const replayBtn = document.querySelector("button");

    const notes = document.querySelectorAll(".note");
    notes.forEach((note) => {
        note.classList.remove("reveal");
        note.style.backgroundColor = ""; // Réinitialiser la couleur de fond
    });
    replayBtn.style.display = "none"

    const resultText = document.querySelector(".result-text");
    resultText.textContent = ""; // Réinitialiser le texte du résultat
    resultText.style.color = ""; // Réinitialiser la couleur du texte
    getRandomScale();
    fullString(randomScale);
    rollNote(randomScale);
    noteReveal();
    replay();
}

launchGame();


