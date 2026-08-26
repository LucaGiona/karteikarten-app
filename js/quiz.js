import {
    state,
    weeklyState,
    persist,
    getVisibleFreeCards,
    getVisibleWeeklyCards,
    DIRECTION_KEYS,
} from "./state.js";
import { cardKey } from "./cards.js";
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

function isAcceptedAnswer(enteredAnswer, card, targetLanguage) {
    const acceptedAnswers = [
        card.terms[targetLanguage],
        ...(card.alternativen?.[targetLanguage] ?? []),
    ];
    const locale = targetLanguage === "en" ? "en" : "de";
    return acceptedAnswers.some(answer => enteredAnswer.localeCompare(
        answer,
        locale,
        { sensitivity: "accent" }
    ) === 0);
}

export function showAnswer() {
    if (state.answerWasChecked) {
        nextCard();
        return;
    }

    const card = getVisibleFreeCards()[state.currentIndex];
    const { back } = DIRECTION_KEYS[state.resolvedDirection];
    const enteredAnswer = dom.answerInput.value.trim();
    const isCorrect = isAcceptedAnswer(enteredAnswer, card, back);

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
    dom.answer.classList.add("is-visible");
    dom.explanation.classList.add("is-visible");
    dom.showAnswerBtn.textContent = "Nächste Karte";
    dom.status.textContent = statusText(card);
    renderBoxes();
    dom.showAnswerBtn.focus();
}

export function nextCard() {
    state.currentIndex = pickCardIndex(getVisibleFreeCards(), state.currentIndex);
    renderCard();
}

export function showWeeklyAnswer() {
    if (weeklyState.answerWasChecked) {
        nextWeeklyCard();
        return;
    }

    const card = getVisibleWeeklyCards()[weeklyState.currentIndex];
    const { back } = DIRECTION_KEYS[weeklyState.resolvedDirection];
    const enteredAnswer = dom.weeklyAnswerInput.value.trim();
    const isCorrect = isAcceptedAnswer(enteredAnswer, card, back);

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
        weeklyState.completedThisSession.add(cardKey(card));
        if (card.box < 5) {
            card.box++;
        }
    } else {
        card.box = 1;
    }
    persist();

    weeklyState.answerWasChecked = true;
    dom.weeklyAnswerInput.disabled = true;
    dom.weeklyAnswer.classList.add("is-visible");
    dom.weeklyExplanation.classList.add("is-visible");
    dom.weeklyShowAnswerBtn.textContent = "Nächste Karte";
    dom.weeklyStatus.textContent = weeklyStatusText(card);
    renderWeeklyGroups();
    dom.weeklyShowAnswerBtn.focus();
}

export function nextWeeklyCard() {
    weeklyState.currentIndex = pickDueCardIndex(
        getVisibleWeeklyCards(),
        weeklyState.todayGroup,
        weeklyState.completedThisSession,
        weeklyState.currentIndex
    );
    renderWeeklyCard();

    if (weeklyState.currentIndex !== -1) {
        dom.weeklyAnswerInput.focus();
    }
}
