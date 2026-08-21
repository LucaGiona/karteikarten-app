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
    answerWasChecked: false,
};

export function persist() {
    const boxes = {};
    cards.forEach(card => {
        boxes[card.latin] = card.box;
    });
    saveProgress({ boxes, direction: state.selectedDirection });
}
