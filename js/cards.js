const DATA_FILES = ["organe.json", "ohr.json"];

const responses = await Promise.all(
    DATA_FILES.map(file => fetch(new URL(`../db/${file}`, import.meta.url)))
);
const cardLists = await Promise.all(responses.map(response => response.json()));
export const defaultCards = cardLists.flat();

export function cardKey(card) {
    return `${card.bereich}:${card.id}`;
}

// Anzeigenamen für bereich/typ. Neuer Bereich oder Typ ohne Eintrag hier
// fällt einfach auf den rohen Datenwert zurück (siehe topicLabel/categoryLabel).
const TOPIC_LABELS = {
    organe: "Organe",
    ohr: "Ohr",
};

const CATEGORY_LABELS = {
    anatomie: "Anatomie",
    erkrankung: "Erkrankungen",
};

export function topicLabel(bereich) {
    return TOPIC_LABELS[bereich] ?? bereich;
}

export function categoryLabel(typ) {
    return CATEGORY_LABELS[typ] ?? typ;
}

const seenKeys = new Set();
defaultCards.forEach(card => {
    if (!/^[a-z0-9-]+$/.test(card.id)) {
        throw new Error(
            `Ungültige Karten-ID "${card.id}" (Bereich "${card.bereich}") – nur Kleinbuchstaben, Ziffern und Bindestriche erlaubt.`
        );
    }
    const key = cardKey(card);
    if (seenKeys.has(key)) {
        throw new Error(`Doppelte Karte "${key}" in den Kartendaten.`);
    }
    seenKeys.add(key);
});
