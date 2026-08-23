import {
    state,
    weeklyState,
    resolveDirection,
    resolveWeeklyDirection,
    getVisibleFreeCards,
    getVisibleWeeklyCards,
    getAvailableCategories,
} from "./state.js";
import * as dom from "./dom.js";
import { MASTERED_BOX, DAY_GROUPS, isCardDueInGroup } from "./leitner.js";
import { cardKey, topicLabel, categoryLabel } from "./cards.js";

const GROUP_TILES = [
    { key: DAY_GROUPS.DAILY, label: "Täglich" },
    { key: DAY_GROUPS.MIDWEEK, label: "Di + Do" },
    { key: DAY_GROUPS.WEEKEND, label: "Wochenende" },
];

export function statusText(card) {
    const visibleCards = getVisibleFreeCards();
    const masteredCount = visibleCards.filter(c => c.box === MASTERED_BOX).length;
    return `Box ${card.box} · ${masteredCount}/${visibleCards.length} gemeistert`;
}

export function renderCard() {
    if (state.currentIndex === -1) {
        renderFinished();
        return;
    }

    const card = getVisibleFreeCards()[state.currentIndex];
    const isLatinToGerman = resolveDirection() === "latin-german";

    dom.contextBadge.textContent =
        `${topicLabel(card.bereich)} · ${categoryLabel(card.typ)}`;
    dom.direction.textContent = isLatinToGerman
        ? "Latein → Deutsch"
        : "Deutsch → Latein";
    dom.question.textContent = isLatinToGerman ? card.terms.la : card.terms.de;
    dom.answer.textContent = isLatinToGerman ? card.terms.de : card.terms.la;
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
    dom.answer.classList.remove("is-visible");
    dom.showAnswerBtn.style.display = "block";
    dom.showAnswerBtn.textContent = "Antwort prüfen";
    dom.status.textContent = statusText(card);

    renderBoxes();
    dom.answerInput.focus();
}

function renderFinished() {
    dom.contextBadge.textContent = "";
    dom.direction.textContent = "";
    dom.question.textContent = "Alle Karten gelernt! 🎉";
    dom.answer.textContent = "";
    dom.answer.classList.remove("is-visible");
    dom.answerInput.style.display = "none";
    dom.answerFeedback.textContent = "";
    dom.answerFeedback.classList.remove(
        "correct-feedback",
        "wrong-feedback"
    );
    dom.showAnswerBtn.style.display = "none";
    const visibleCount = getVisibleFreeCards().length;
    dom.status.textContent =
        `${visibleCount}/${visibleCount} in Box ${MASTERED_BOX} gemeistert`;

    renderBoxes();
}

export function weeklyStatusText(card) {
    const remaining = getVisibleWeeklyCards().filter(
        c =>
            isCardDueInGroup(c, weeklyState.todayGroup) &&
            !weeklyState.completedThisSession.has(cardKey(c))
    ).length;
    return `Box ${card.box} · noch ${remaining} heute fällig`;
}

export function renderWeeklyCard() {
    if (weeklyState.currentIndex === -1) {
        renderWeeklyFinished();
        return;
    }

    const card = getVisibleWeeklyCards()[weeklyState.currentIndex];
    const isLatinToGerman = resolveWeeklyDirection() === "latin-german";

    dom.weeklyContextBadge.textContent =
        `${topicLabel(card.bereich)} · ${categoryLabel(card.typ)}`;
    dom.weeklyDirection.textContent = isLatinToGerman
        ? "Latein → Deutsch"
        : "Deutsch → Latein";
    dom.weeklyQuestion.textContent = isLatinToGerman ? card.terms.la : card.terms.de;
    dom.weeklyAnswer.textContent = isLatinToGerman ? card.terms.de : card.terms.la;
    dom.weeklyAnswerInput.style.display = "block";
    dom.weeklyAnswerInput.value = "";
    dom.weeklyAnswerInput.disabled = false;
    dom.weeklyAnswerInput.classList.remove("is-correct", "is-wrong");
    dom.weeklyAnswerFeedback.textContent = "";
    dom.weeklyAnswerFeedback.classList.remove(
        "correct-feedback",
        "wrong-feedback"
    );
    weeklyState.answerWasChecked = false;
    dom.weeklyAnswer.classList.remove("is-visible");
    dom.weeklyShowAnswerBtn.style.display = "block";
    dom.weeklyShowAnswerBtn.textContent = "Antwort prüfen";
    dom.weeklyStatus.textContent = weeklyStatusText(card);

    renderWeeklyGroups();
}

function renderWeeklyFinished() {
    dom.weeklyContextBadge.textContent = "";
    dom.weeklyDirection.textContent = "";
    dom.weeklyQuestion.textContent = "Für heute bist du fertig! 🎉";
    dom.weeklyAnswer.textContent = "";
    dom.weeklyAnswer.classList.remove("is-visible");
    dom.weeklyAnswerInput.style.display = "none";
    dom.weeklyAnswerFeedback.textContent = "";
    dom.weeklyAnswerFeedback.classList.remove(
        "correct-feedback",
        "wrong-feedback"
    );
    dom.weeklyShowAnswerBtn.style.display = "none";
    dom.weeklyStatus.textContent = "Alle heute fälligen Karten geschafft.";

    renderWeeklyGroups();
}

export function renderWeeklyGroups() {
    dom.weeklyGroups.innerHTML = "";

    GROUP_TILES.forEach(({ key, label }) => {
        const count = getVisibleWeeklyCards().filter(
            card =>
                isCardDueInGroup(card, key) &&
                !weeklyState.completedThisSession.has(cardKey(card))
        ).length;
        const tileElement = document.createElement("div");

        tileElement.classList.add("group-tile");
        if (key === weeklyState.todayGroup) {
            tileElement.classList.add("group-tile--today");
        }
        tileElement.textContent = label;

        const countLabel = document.createElement("span");
        countLabel.classList.add("group-tile-count");
        countLabel.textContent = count;
        tileElement.appendChild(countLabel);

        dom.weeklyGroups.appendChild(tileElement);
    });
}

// Baut die Kategorie-Buttons anhand der Karten des aktuell gewählten
// Themas neu auf. So taucht z.B. "Erkrankungen" nur auf, solange das
// gewählte Thema tatsächlich Krankheits-Karten enthält.
export function renderCategoryButtons() {
    const availableCategories = getAvailableCategories();

    dom.categoryAllBtn.classList.toggle(
        "is-active",
        state.selectedCategory === "all"
    );

    dom.categoryButtonsRow.innerHTML = "";
    availableCategories.forEach(typ => {
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("topic-btn");
        button.dataset.category = typ;
        button.textContent = categoryLabel(typ);
        if (typ === state.selectedCategory) {
            button.classList.add("is-active");
        }
        dom.categoryButtonsRow.appendChild(button);
    });
}

export function renderBoxes() {
    dom.boxes.innerHTML = "";

    const visibleFreeCards = getVisibleFreeCards();
    for (let boxNumber = 1; boxNumber <= 5; boxNumber++) {
        const count = visibleFreeCards.filter(card => card.box === boxNumber).length;
        const boxElement = document.createElement("div");

        boxElement.classList.add("box");
        boxElement.dataset.box = boxNumber;
        boxElement.textContent = `Box ${boxNumber}`;

        const countLabel = document.createElement("span");
        countLabel.classList.add("box-count");
        countLabel.textContent = count;
        boxElement.appendChild(countLabel);

        dom.boxes.appendChild(boxElement);
    }
}
