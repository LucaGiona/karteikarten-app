import { defaultCards } from "./cards.js";
import { loadProgress, saveProgress } from "./storage.js";
import { pickCardIndex, pickDueCardIndex, getTodayGroup } from "./leitner.js";

const progress = loadProgress();
// Fallback für alte Speicherstände (vor der Trennung in freeBoxes/weeklyBoxes),
// damit bestehender Fortschritt beim Umstellen nicht verloren geht.
const legacyBoxes = progress?.boxes ?? null;

// Freies Lernen und Wochenmodus sind zwei unabhängige Leitner-Systeme mit
// eigenem Kartenfortschritt (card.box) und eigenem Reset – nur die
// Karteninhalte (latin/german) stammen aus derselben Quelle.
export const freeCards = defaultCards.map(card => ({
    ...card,
    box: progress?.freeBoxes?.[card.latin] ?? legacyBoxes?.[card.latin] ?? card.box,
}));

export const weeklyCards = defaultCards.map(card => ({
    ...card,
    box: progress?.weeklyBoxes?.[card.latin] ?? legacyBoxes?.[card.latin] ?? card.box,
}));

export const state = {
    currentIndex: pickCardIndex(freeCards),
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

// Eigener, nicht persistierter Zustand: completedThisSession verhindert,
// dass eine am Wochenende bereits richtig beantwortete Box-5-Karte in
// derselben Sitzung erneut auftaucht (sie bleibt ja in Box 5 und wäre sonst
// laut isCardDueInGroup weiterhin fällig).
export const weeklyState = {
    todayGroup: getTodayGroup(),
    currentIndex: -1,
    resolvedDirection: progress?.direction ?? "latin-german",
    answerWasChecked: false,
    completedThisSession: new Set(),
};
weeklyState.currentIndex = pickDueCardIndex(
    weeklyCards,
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
    const freeBoxes = {};
    freeCards.forEach(card => {
        freeBoxes[card.latin] = card.box;
    });
    const weeklyBoxes = {};
    weeklyCards.forEach(card => {
        weeklyBoxes[card.latin] = card.box;
    });
    saveProgress({ freeBoxes, weeklyBoxes, direction: state.selectedDirection });
}

export function resetFreeProgress() {
    freeCards.forEach(card => {
        card.box = 1;
    });
    state.currentIndex = pickCardIndex(freeCards);
    state.answerWasChecked = false;
    persist();
}

export function resetWeeklyProgress() {
    weeklyCards.forEach(card => {
        card.box = 1;
    });
    weeklyState.completedThisSession.clear();
    weeklyState.currentIndex = pickDueCardIndex(
        weeklyCards,
        weeklyState.todayGroup,
        weeklyState.completedThisSession
    );
    weeklyState.answerWasChecked = false;
    persist();
}
