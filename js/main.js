import { state, persist } from "./state.js";
import * as dom from "./dom.js";
import { renderCard } from "./render.js";
import { showAnswer, nextCard } from "./quiz.js";

dom.directionOptions.forEach(option => {
    option.checked = option.value === state.selectedDirection;
});

dom.showAnswerBtn.addEventListener("click", showAnswer);
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

renderCard();
