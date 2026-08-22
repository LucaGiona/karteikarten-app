import { state, weeklyState, persist, resetFreeProgress, resetWeeklyProgress } from "./state.js";
import * as dom from "./dom.js";
import { renderCard, renderWeeklyCard } from "./render.js";
import { showAnswer, nextCard, showWeeklyAnswer, nextWeeklyCard } from "./quiz.js";
import { initializeInfoDialog } from "./info-dialog.js";

dom.directionOptions.forEach(option => {
    option.checked = option.value === state.selectedDirection;
});

dom.showAnswerBtn.addEventListener("click", showAnswer);
dom.resetProgressBtn.addEventListener("click", () => {
    resetFreeProgress();
    renderCard();
});
dom.answerInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        showAnswer();
    }
});
document.addEventListener("keydown", event => {
    if (event.key === "Enter" && state.answerWasChecked) {
        event.preventDefault();
        nextCard();
    }
});
dom.directionOptions.forEach(option => {
    option.addEventListener("change", event => {
        state.selectedDirection = event.target.value;
        persist();
        renderCard();
    });
});

dom.weeklyShowAnswerBtn.addEventListener("click", showWeeklyAnswer);
dom.weeklyResetProgressBtn.addEventListener("click", () => {
    resetWeeklyProgress();
    renderWeeklyCard();
});
dom.weeklyAnswerInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        showWeeklyAnswer();
    }
});
document.addEventListener("keydown", event => {
    if (event.key === "Enter" && weeklyState.answerWasChecked) {
        event.preventDefault();
        nextWeeklyCard();
    }
});

initializeInfoDialog();

renderCard();
renderWeeklyCard();
