import { defaultCards } from "./cards.js";
import { loadProgress, saveProgress } from "./storage.js";
import { pickCardIndex } from "./leitner.js";

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
    persist();
}
