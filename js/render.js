import { cards, state } from "./state.js";
import * as dom from "./dom.js";
import { MASTERED_BOX } from "./leitner.js";

export function statusText(card) {
    const masteredCount = cards.filter(c => c.box === MASTERED_BOX).length;
    return `Box ${card.box} · ${masteredCount}/${cards.length} gemeistert`;
}

export function renderCard() {
    if (state.currentIndex === -1) {
        renderFinished();
        return;
    }

    const card = cards[state.currentIndex];
    const isLatinToGerman = state.selectedDirection === "latin-german";

    dom.direction.textContent = isLatinToGerman
        ? "Latein → Deutsch"
        : "Deutsch → Latein";
    dom.question.textContent = isLatinToGerman ? card.latin : card.german;
    dom.answer.textContent = isLatinToGerman ? card.german : card.latin;
    dom.answerInput.style.display = "block";
    dom.answerInput.value = "";
    dom.answerInput.disabled = false;
    dom.answerInput.classList.remove("is-correct", "is-wrong");
    dom.answerFeedback.textContent = "";
    dom.answerFeedback.classList.remove(
        "correct-feedback",
        "wrong-feedback"
    );
    state.answerWasChecked = false;
    dom.answer.style.display = "none";
    dom.showAnswerBtn.style.display = "block";
    dom.showAnswerBtn.textContent = "Antwort prüfen";
    dom.status.textContent = statusText(card);

    renderBoxes();
    dom.answerInput.focus();
}

function renderFinished() {
    dom.direction.textContent = "";
    dom.question.textContent = "Alle Karten gelernt! 🎉";
    dom.answer.textContent = "";
    dom.answer.style.display = "none";
    dom.answerInput.style.display = "none";
    dom.answerFeedback.textContent = "";
    dom.answerFeedback.classList.remove(
        "correct-feedback",
        "wrong-feedback"
    );
    dom.showAnswerBtn.style.display = "none";
    dom.status.textContent =
        `${cards.length}/${cards.length} in Box ${MASTERED_BOX} gemeistert`;

    renderBoxes();
}

export function renderBoxes() {
    dom.boxes.innerHTML = "";

    for (let boxNumber = 1; boxNumber <= 5; boxNumber++) {
        const count = cards.filter(card => card.box === boxNumber).length;
        const boxElement = document.createElement("div");

        boxElement.classList.add("box");
        boxElement.textContent = `Box ${boxNumber}: ${count}`;
        dom.boxes.appendChild(boxElement);
    }
}
