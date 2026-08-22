import { freeCards, weeklyCards, state, weeklyState, persist } from "./state.js";
import * as dom from "./dom.js";
import {
    renderCard,
    renderBoxes,
    statusText,
    renderWeeklyCard,
    renderWeeklyGroups,
    weeklyStatusText,
} from "./render.js";
import { pickCardIndex, pickDueCardIndex } from "./leitner.js";

export function showAnswer() {
    if (state.answerWasChecked) {
        nextCard();
        return;
    }

    const card = freeCards[state.currentIndex];
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
    state.currentIndex = pickCardIndex(freeCards, state.currentIndex);
    renderCard();
}

export function showWeeklyAnswer() {
    if (weeklyState.answerWasChecked) {
        nextWeeklyCard();
        return;
    }

    const card = weeklyCards[weeklyState.currentIndex];
    const expectedAnswer = weeklyState.resolvedDirection === "latin-german"
        ? card.german
        : card.latin;
    const enteredAnswer = dom.weeklyAnswerInput.value.trim();
    const isLatinAnswer = weeklyState.resolvedDirection === "german-latin";
    const isCorrect = isLatinAnswer
        ? enteredAnswer.localeCompare(
            expectedAnswer,
            "de",
            { sensitivity: "accent" }
        ) === 0
        : enteredAnswer === expectedAnswer;

    dom.weeklyAnswerInput.classList.add(isCorrect ? "is-correct" : "is-wrong");
    dom.weeklyAnswerFeedback.classList.add(
        isCorrect ? "correct-feedback" : "wrong-feedback"
    );
    dom.weeklyAnswerFeedback.textContent = isCorrect
        ? "Richtig!"
        : "Nicht ganz – die richtige Antwort lautet:";

    if (isCorrect) {
        // Karte gilt für die heutige Wochen-Session als erledigt, auch wenn
        // sie (z.B. aus Box 5 am Wochenende) laut isCardDueInGroup weiterhin
        // "fällig" wäre – sonst könnte sie in derselben Sitzung endlos
        // wieder ausgewählt werden.
        weeklyState.completedThisSession.add(card.latin);
        if (card.box < 5) {
            card.box++;
        }
    } else {
        card.box = 1;
    }
    persist();

    weeklyState.answerWasChecked = true;
    dom.weeklyAnswerInput.disabled = true;
    dom.weeklyAnswer.style.display = "block";
    dom.weeklyShowAnswerBtn.textContent = "Nächste Karte";
    dom.weeklyStatus.textContent = weeklyStatusText(card);
    renderWeeklyGroups();
    dom.weeklyShowAnswerBtn.focus();
}

export function nextWeeklyCard() {
    weeklyState.currentIndex = pickDueCardIndex(
        weeklyCards,
        weeklyState.todayGroup,
        weeklyState.completedThisSession,
        weeklyState.currentIndex
    );
    renderWeeklyCard();
}
