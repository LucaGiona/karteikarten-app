import { freeCards, weeklyCards, state, weeklyState, resolveDirection, resolveWeeklyDirection } from "./state.js";
import * as dom from "./dom.js";
import { MASTERED_BOX, DAY_GROUPS, isCardDueInGroup } from "./leitner.js";

const GROUP_TILES = [
    { key: DAY_GROUPS.DAILY, label: "Täglich" },
    { key: DAY_GROUPS.MIDWEEK, label: "Di + Do" },
    { key: DAY_GROUPS.WEEKEND, label: "Wochenende" },
];

export function statusText(card) {
    const masteredCount = freeCards.filter(c => c.box === MASTERED_BOX).length;
    return `Box ${card.box} · ${masteredCount}/${freeCards.length} gemeistert`;
}

export function renderCard() {
    if (state.currentIndex === -1) {
        renderFinished();
        return;
    }

    const card = freeCards[state.currentIndex];
    const isLatinToGerman = resolveDirection() === "latin-german";

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
        `${freeCards.length}/${freeCards.length} in Box ${MASTERED_BOX} gemeistert`;

    renderBoxes();
}

export function weeklyStatusText(card) {
    const remaining = weeklyCards.filter(
        c =>
            isCardDueInGroup(c, weeklyState.todayGroup) &&
            !weeklyState.completedThisSession.has(c.latin)
    ).length;
    return `Box ${card.box} · noch ${remaining} heute fällig`;
}

export function renderWeeklyCard() {
    if (weeklyState.currentIndex === -1) {
        renderWeeklyFinished();
        return;
    }

    const card = weeklyCards[weeklyState.currentIndex];
    const isLatinToGerman = resolveWeeklyDirection() === "latin-german";

    dom.weeklyDirection.textContent = isLatinToGerman
        ? "Latein → Deutsch"
        : "Deutsch → Latein";
    dom.weeklyQuestion.textContent = isLatinToGerman ? card.latin : card.german;
    dom.weeklyAnswer.textContent = isLatinToGerman ? card.german : card.latin;
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
    dom.weeklyAnswer.style.display = "none";
    dom.weeklyShowAnswerBtn.style.display = "block";
    dom.weeklyShowAnswerBtn.textContent = "Antwort prüfen";
    dom.weeklyStatus.textContent = weeklyStatusText(card);

    renderWeeklyGroups();
    dom.weeklyAnswerInput.focus();
}

function renderWeeklyFinished() {
    dom.weeklyDirection.textContent = "";
    dom.weeklyQuestion.textContent = "Für heute bist du fertig! 🎉";
    dom.weeklyAnswer.textContent = "";
    dom.weeklyAnswer.style.display = "none";
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
        const count = weeklyCards.filter(
            card =>
                isCardDueInGroup(card, key) &&
                !weeklyState.completedThisSession.has(card.latin)
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

export function renderBoxes() {
    dom.boxes.innerHTML = "";

    for (let boxNumber = 1; boxNumber <= 5; boxNumber++) {
        const count = freeCards.filter(card => card.box === boxNumber).length;
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
