import { defaultCards, cardKey } from "./cards.js";
import { loadProgress, saveProgress } from "./storage.js";
import { pickCardIndex, pickDueCardIndex, getTodayGroup } from "./leitner.js";

const progress = loadProgress();

// Freies Lernen und Wochenmodus sind zwei unabhängige Leitner-Systeme mit
// eigenem Kartenfortschritt (card.box) und eigenem Reset – nur die
// Karteninhalte (id/terms) stammen aus derselben Quelle. Der Fortschritt
// wird über bereich:id gekeyt, damit gleiche ids in verschiedenen
// Bereichs-Dateien (anatomie.json, krankheiten.json, ...) nicht kollidieren.
export const freeCards = defaultCards.map(card => ({
    ...card,
    box: progress?.freeBoxes?.[cardKey(card)] ?? 1,
}));

export const weeklyCards = defaultCards.map(card => ({
    ...card,
    box: progress?.weeklyBoxes?.[cardKey(card)] ?? 1,
}));

export const state = {
    currentIndex: pickCardIndex(freeCards),
    selectedDirection: progress?.direction ?? "latin-german",
    resolvedDirection: progress?.direction ?? "latin-german",
    // Themen-Filter wird bewusst nicht persistiert: "Alle" soll nach jedem
    // Neuladen wieder aktiv sein, unabhängig von der zuletzt gewählten Karte.
    selectedTopic: "all",
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
        freeBoxes[cardKey(card)] = card.box;
    });
    const weeklyBoxes = {};
    weeklyCards.forEach(card => {
        weeklyBoxes[cardKey(card)] = card.box;
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
