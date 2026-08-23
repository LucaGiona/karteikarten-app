import {
    state,
    weeklyState,
    persist,
    resetFreeProgress,
    resetWeeklyProgress,
    applyCardFilters,
} from "./state.js";
import * as dom from "./dom.js";
import { renderCard, renderWeeklyCard, renderCategoryButtons } from "./render.js";
import { showAnswer, nextCard, showWeeklyAnswer, nextWeeklyCard } from "./quiz.js";
import { initializeInfoDialog } from "./info-dialog.js";

dom.directionOptions.forEach(option => {
    option.checked = option.value === state.selectedDirection;
});

function openMode(contentToShow, startBtnToHide, contentToHide, startBtnToShow, scrollTarget) {
    contentToShow.hidden = false;
    startBtnToHide.hidden = true;
    contentToHide.hidden = true;
    startBtnToShow.hidden = false;
    scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
}

function goToLanding() {
    dom.freeModeContent.hidden = true;
    dom.freeModeStartBtn.hidden = false;
    dom.weeklyModeContent.hidden = true;
    dom.weeklyModeStartBtn.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

dom.freeModeBackBtn.addEventListener("click", goToLanding);
dom.weeklyModeBackBtn.addEventListener("click", goToLanding);

dom.freeModeStartBtn.addEventListener("click", () => {
    openMode(
        dom.freeModeContent,
        dom.freeModeStartBtn,
        dom.weeklyModeContent,
        dom.weeklyModeStartBtn,
        dom.freeModeBackBtn
    );
});

dom.showAnswerBtn.addEventListener("click", showAnswer);
dom.resetProgressBtn.addEventListener("click", () => {
    const shouldReset = window.confirm(
        "Möchtest du den Lernfortschritt im freien Lernen wirklich zurücksetzen?"
    );
    if (!shouldReset) {
        return;
    }

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

dom.topicButtons.forEach(button => {
    button.addEventListener("click", () => {
        state.selectedTopic = button.dataset.topic;
        dom.topicButtons.forEach(btn => {
            btn.classList.toggle("is-active", btn === button);
        });
        applyCardFilters();
        // Themawechsel kann die verfügbaren Kategorien ändern (z.B. "Organe"
        // hat aktuell keine Erkrankungen) – Kategorie-Buttons daher neu bauen.
        renderCategoryButtons();
        renderCard();
        renderWeeklyCard();
    });
});

// Kategorie-Buttons werden je nach Thema dynamisch neu erzeugt (siehe
// renderCategoryButtons in render.js), deshalb hier ein delegierter Klick-
// Handler auf dem umschliessenden Fieldset statt einzelner Listener.
dom.categorySelector.addEventListener("click", event => {
    const button = event.target.closest(".topic-btn");
    if (!button) {
        return;
    }

    state.selectedCategory = button.dataset.category;
    applyCardFilters();
    renderCategoryButtons();
    renderCard();
    renderWeeklyCard();
});

dom.weeklyModeStartBtn.addEventListener("click", () => {
    openMode(
        dom.weeklyModeContent,
        dom.weeklyModeStartBtn,
        dom.freeModeContent,
        dom.freeModeStartBtn,
        dom.weeklyModeBackBtn
    );
});

dom.weeklyShowAnswerBtn.addEventListener("click", showWeeklyAnswer);
dom.weeklyResetProgressBtn.addEventListener("click", () => {
    const shouldReset = window.confirm(
        "Möchtest du den Lernfortschritt im Wochenmodus wirklich zurücksetzen?"
    );
    if (!shouldReset) {
        return;
    }

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

renderCategoryButtons();
renderCard();
renderWeeklyCard();
