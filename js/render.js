import {
    state,
    weeklyState,
    resolveDirection,
    resolveWeeklyDirection,
    getVisibleFreeCards,
    getVisibleWeeklyCards,
    getAvailableCategories,
    DIRECTION_KEYS,
    DIRECTION_LABELS,
} from "./state.js";
import * as dom from "./dom.js";
import { MASTERED_BOX, DAY_GROUPS, isCardDueInGroup } from "./leitner.js";
import { cardKey, topicLabel, subtopicLabel, categoryLabel } from "./cards.js";

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
    const visibleCards = getVisibleFreeCards();
    if (visibleCards.length === 0) {
        renderNoCardsForFilter();
        return;
    }
    if (state.currentIndex === -1) {
        renderFinished();
        return;
    }

    const card = visibleCards[state.currentIndex];
    const direction = resolveDirection();
    const { front, back } = DIRECTION_KEYS[direction];

    dom.contextBadge.textContent =
        `${topicLabel(card.fach)}${card.unterbereich ? ` · ${subtopicLabel(card.unterbereich)}` : ""} · ${categoryLabel(card.typ)}`;
    dom.direction.textContent = DIRECTION_LABELS[direction];
    dom.question.textContent = card.terms[front];
    dom.answer.textContent = card.terms[back];
    dom.explanation.textContent = card.erklaerung ?? "";
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
    dom.explanation.classList.remove("is-visible");
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
    dom.explanation.textContent = "";
    dom.explanation.classList.remove("is-visible");
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

// Leerer Filter (0 sichtbare Karten für Thema/Kategorie) ist kein
// abgeschlossener Lerndurchgang – ohne diese eigene Meldung würde
// renderFinished() fälschlich "Alle Karten gelernt!" zeigen, da
// pickCardIndex() für ein leeres Array denselben Index (-1) liefert wie für
// "alle gemeistert".
function renderNoCardsForFilter() {
    dom.contextBadge.textContent = "";
    dom.direction.textContent = "";
    dom.question.textContent = "Keine Karten für diese Auswahl.";
    dom.answer.textContent = "";
    dom.answer.classList.remove("is-visible");
    dom.explanation.textContent = "";
    dom.explanation.classList.remove("is-visible");
    dom.answerInput.style.display = "none";
    dom.answerFeedback.textContent = "";
    dom.answerFeedback.classList.remove(
        "correct-feedback",
        "wrong-feedback"
    );
    dom.showAnswerBtn.style.display = "none";
    dom.status.textContent = "Bitte Filter oder Abfragerichtung ändern.";

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
    const visibleWeeklyCards = getVisibleWeeklyCards();
    if (visibleWeeklyCards.length === 0) {
        renderNoWeeklyCardsForFilter();
        return;
    }
    if (weeklyState.currentIndex === -1) {
        renderWeeklyFinished();
        return;
    }

    const card = visibleWeeklyCards[weeklyState.currentIndex];
    const direction = resolveWeeklyDirection();
    const { front, back } = DIRECTION_KEYS[direction];

    dom.weeklyContextBadge.textContent =
        `${topicLabel(card.fach)}${card.unterbereich ? ` · ${subtopicLabel(card.unterbereich)}` : ""} · ${categoryLabel(card.typ)}`;
    dom.weeklyDirection.textContent = DIRECTION_LABELS[direction];
    dom.weeklyQuestion.textContent = card.terms[front];
    dom.weeklyAnswer.textContent = card.terms[back];
    dom.weeklyExplanation.textContent = card.erklaerung ?? "";
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
    dom.weeklyExplanation.classList.remove("is-visible");
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
    dom.weeklyExplanation.textContent = "";
    dom.weeklyExplanation.classList.remove("is-visible");
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

// Gleicher Grund wie renderNoCardsForFilter(): 0 sichtbare Karten für
// Thema/Kategorie darf nicht als "für heute fertig" durchgehen.
function renderNoWeeklyCardsForFilter() {
    dom.weeklyContextBadge.textContent = "";
    dom.weeklyDirection.textContent = "";
    dom.weeklyQuestion.textContent = "Keine Karten für diese Auswahl.";
    dom.weeklyAnswer.textContent = "";
    dom.weeklyAnswer.classList.remove("is-visible");
    dom.weeklyExplanation.textContent = "";
    dom.weeklyExplanation.classList.remove("is-visible");
    dom.weeklyAnswerInput.style.display = "none";
    dom.weeklyAnswerFeedback.textContent = "";
    dom.weeklyAnswerFeedback.classList.remove(
        "correct-feedback",
        "wrong-feedback"
    );
    dom.weeklyShowAnswerBtn.style.display = "none";
    dom.weeklyStatus.textContent = "Bitte Filter oder Abfragerichtung ändern.";

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

export function renderSubtopicButtons() {
    const subtopics = ["ohr", "nase", "rachen", "kehlkopf", "allgemein"];
    dom.subtopicSelector.hidden = state.selectedTopic !== "hno";
    dom.subtopicButtonsRow.innerHTML = "";

    subtopics.forEach(subtopic => {
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("topic-btn");
        button.dataset.subtopic = subtopic;
        button.textContent = subtopicLabel(subtopic);
        button.classList.toggle("is-active", subtopic === state.selectedSubtopic);
        dom.subtopicButtonsRow.appendChild(button);
    });

    const allButton = dom.subtopicSelector.querySelector('[data-subtopic="all"]');
    allButton.classList.toggle("is-active", state.selectedSubtopic === "all");
}

// Freies Lernen und Wochenmodus teilen sich Thema-/Kategorie-Filter, daher
// ist die Trefferzahl für beide Modi identisch – getVisibleFreeCards()
// reicht als gemeinsame Quelle.
export function renderFilterCount() {
    const count = getVisibleFreeCards().length;
    dom.filterCount.textContent =
        `${count} Karte${count === 1 ? "" : "n"} in dieser Auswahl`;
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
