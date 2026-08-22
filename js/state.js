import { defaultCards } from "./cards.js";
import { loadProgress, saveProgress } from "./storage.js";
import { pickCardIndex, pickDueCardIndex, getTodayGroup } from "./leitner.js";

const progress = loadProgress();

export const cards = defaultCards.map(card => ({
    ...card,
    box: progress?.boxes?.[card.latin] ?? card.box,
}));

export const state = {
    currentIndex: pickCardIndex(cards),
    selectedDirection: progress?.direction ?? "latin-german",
    resolvedDirection: progress?.direction ?? "latin-german",
    answerWasChecked: false,
};

export function resolveDirection() {
    state.resolvedDirection = state.selectedDirection === "random"
        ? (Math.random() < 0.5 ? "latin-german" : "german-latin")
        : state.selectedDirection;
    return state.resolvedDirection;
}

// Wochenmodus läuft parallel zum freien Lernen und teilt sich nur die
// card.box-Werte. Eigener, nicht persistierter Zustand: completedThisSession
// verhindert, dass eine am Wochenende bereits richtig beantwortete
// Box-5-Karte in derselben Sitzung erneut auftaucht (sie bleibt ja in Box 5
// und wäre sonst laut isCardDueInGroup weiterhin fällig).
export const weeklyState = {
    todayGroup: getTodayGroup(),
    currentIndex: -1,
    resolvedDirection: progress?.direction ?? "latin-german",
    answerWasChecked: false,
    completedThisSession: new Set(),
};
weeklyState.currentIndex = pickDueCardIndex(
    cards,
    weeklyState.todayGroup,
    weeklyState.completedThisSession
);

export function resolveWeeklyDirection() {
    weeklyState.resolvedDirection = state.selectedDirection === "random"
        ? (Math.random() < 0.5 ? "latin-german" : "german-latin")
        : state.selectedDirection;
    return weeklyState.resolvedDirection;
}

export function persist() {
    const boxes = {};
    cards.forEach(card => {
        boxes[card.latin] = card.box;
    });
    saveProgress({ boxes, direction: state.selectedDirection });
}

export function resetProgress() {
    cards.forEach(card => {
        card.box = 1;
    });
    state.currentIndex = pickCardIndex(cards);
    state.answerWasChecked = false;
    weeklyState.completedThisSession.clear();
    weeklyState.currentIndex = pickDueCardIndex(
        cards,
        weeklyState.todayGroup,
        weeklyState.completedThisSession
    );
    weeklyState.answerWasChecked = false;
    persist();
}
