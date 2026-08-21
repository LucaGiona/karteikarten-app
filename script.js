const cards = [
    { latin: "Cor", german: "Herz", box: 1 },
    { latin: "Pulmo", german: "Lunge", box: 1 },
    { latin: "Hepar", german: "Leber", box: 1 },
    { latin: "Ren", german: "Niere", box: 1 },
    { latin: "Ventriculus", german: "Magen", box: 1 }
];

let currentIndex = 0;

const question = document.querySelector("#question");
const answer = document.querySelector("#answer");
const showAnswerBtn = document.querySelector("#showAnswerBtn");
const ratingButtons = document.querySelector("#ratingButtons");
const correctBtn = document.querySelector("#correctBtn");
const wrongBtn = document.querySelector("#wrongBtn");
const boxes = document.querySelector("#boxes");
const status = document.querySelector("#status");

function renderCard() {
    const card = cards[currentIndex];

    question.textContent = card.latin;
    answer.textContent = card.german;
    answer.style.display = "none";
    ratingButtons.style.display = "none";
    showAnswerBtn.style.display = "block";
    status.textContent =
        `Karte ${currentIndex + 1} von ${cards.length} · Box ${card.box}`;

    renderBoxes();
}

function renderBoxes() {
    boxes.innerHTML = "";

    for (let boxNumber = 1; boxNumber <= 5; boxNumber++) {
        const count = cards.filter(card => card.box === boxNumber).length;
        const boxElement = document.createElement("div");

        boxElement.classList.add("box");
        boxElement.textContent = `Box ${boxNumber}: ${count}`;
        boxes.appendChild(boxElement);
    }
}

function showAnswer() {
    answer.style.display = "block";
    showAnswerBtn.style.display = "none";
    ratingButtons.style.display = "flex";
}

function answerCorrect() {
    const card = cards[currentIndex];

    if (card.box < 5) {
        card.box++;
    }

    nextCard();
}

function answerWrong() {
    cards[currentIndex].box = 1;
    nextCard();
}

function nextCard() {
    currentIndex++;

    if (currentIndex >= cards.length) {
        currentIndex = 0;
    }

    renderCard();
}

showAnswerBtn.addEventListener("click", showAnswer);
correctBtn.addEventListener("click", answerCorrect);
wrongBtn.addEventListener("click", answerWrong);

renderCard();
