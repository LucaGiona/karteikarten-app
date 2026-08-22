import { cards, state, persist } from "./state.js";
import * as dom from "./dom.js";
import { renderCard, renderBoxes, statusText } from "./render.js";
import { pickCardIndex } from "./leitner.js";

export function showAnswer() {
    if (state.answerWasChecked) {
        nextCard();
        return;
    }

    const card = cards[state.currentIndex];
    const expectedAnswer = state.resolvedDirection === "latin-german"
        ? card.german
        : card.latin;
    const enteredAnswer = dom.answerInput.value.trim();
    const isLatinAnswer = state.resolvedDirection === "german-latin";
    const isCorrect = isLatinAnswer
        ? enteredAnswer.localeCompare(
            expectedAnswer,
            "de",
            { sensitivity: "accent" }
        ) === 0
        : enteredAnswer === expectedAnswer;

    dom.answerInput.classList.add(isCorrect ? "is-correct" : "is-wrong");
    dom.answerFeedback.classList.add(
        isCorrect ? "correct-feedback" : "wrong-feedback"
    );
    dom.answerFeedback.textContent = isCorrect
        ? "Richtig!"
        : "Nicht ganz – die richtige Antwort lautet:";

    if (isCorrect && card.box < 5) {
        card.box++;
    } else if (!isCorrect) {
        card.box = 1;
    }
    persist();

    state.answerWasChecked = true;
    dom.answerInput.disabled = true;
    dom.answer.style.display = "block";
    dom.showAnswerBtn.textContent = "Nächste Karte";
    dom.status.textContent = statusText(card);
    renderBoxes();
    dom.showAnswerBtn.focus();
}

export function nextCard() {
    state.currentIndex = pickCardIndex(cards, state.currentIndex);
    renderCard();
}
