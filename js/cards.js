const DATA_FILES = ["organe.json", "ohr.json", "hno.json"];

const responses = await Promise.all(
    DATA_FILES.map(file => fetch(new URL(`../db/${file}`, import.meta.url)))
);
const cardLists = await Promise.all(responses.map(response => response.json()));

const HNO_SUBTOPIC_IDS = {
    ohr: new Set([
        "adhaesivprozess", "antrotomie", "cholesteatom",
        "diskriminationsfaehigkeit", "elektronystagmographie",
        "elektrische-reaktionsaudiometrie", "fazialisdekompression",
        "haematympanon", "impedanzmessung", "kalorische-pruefung",
        "mastoidektomie", "m-ni-re-erkrankung", "nystagmus",
        "otosklerose", "parazentese", "probetympanotomie", "surditas",
        "tympanogramm", "tympanometrie", "valsalva-versuch",
        "vestibularapparat", "zerumen",
    ]),
    nase: new Set([
        "anosmie", "bellocq-tamponade", "empyem", "epistaxis",
        "frontobasale-verletzung", "konchotom", "olfaktometrie", "polyp",
        "rhinitis", "rhinolith", "rhinophym", "sinusitis", "synechie",
        "zele",
    ]),
    rachen: new Set([
        "adenoide-vegetationen", "adenotomie", "aspiration", "bougierung",
        "divertikel", "elektrogustometrie", "foetor-ex-ore",
        "globusgefuehle", "glossitis", "gustometrie", "hyperplasie",
        "parotidektomie", "peritonsillarabszess", "pharyngitis", "ranula",
        "refluxoesophagitis", "sialadenitis", "sialographie", "stomatitis",
        "tonsillektomie", "uvula", "waldeyerscher-rachenring",
        "zenkersches-divertikel",
    ]),
    kehlkopf: new Set([
        "balbuties", "chordektomie", "dekanuelement", "dysphonie", "glottis",
        "koniotomie", "laryngektomie", "laryngitis", "laryngoskopie",
        "pseudokrupp", "reinke-oedem", "rekurrensparese", "sigmatismus",
        "stridor", "tracheostoma", "tracheotomie",
    ]),
};

function hnoSubtopic(card) {
    if (card.bereich === "ohr") {
        return "ohr";
    }
    for (const [subtopic, ids] of Object.entries(HNO_SUBTOPIC_IDS)) {
        if (ids.has(card.id)) {
            return subtopic;
        }
    }
    return "allgemein";
}

export const defaultCards = cardLists.flat().map(card => ({
    ...card,
    fach: card.bereich === "organe" ? "organe" : "hno",
    unterbereich: card.bereich === "organe" ? null : hnoSubtopic(card),
}));

export function cardKey(card) {
    return `${card.bereich}:${card.id}`;
}

// Anzeigenamen für bereich/typ. Neuer Bereich oder Typ ohne Eintrag hier
// fällt einfach auf den rohen Datenwert zurück (siehe topicLabel/categoryLabel).
const TOPIC_LABELS = {
    organe: "Organe",
    hno: "HNO",
};

const SUBTOPIC_LABELS = {
    ohr: "Ohr und Hören",
    nase: "Nase und Nebenhöhlen",
    rachen: "Mund, Rachen und Schlucken",
    kehlkopf: "Kehlkopf und Stimme",
    allgemein: "Allgemeine HNO",
};

const CATEGORY_LABELS = {
    anatomie: "Anatomie",
    erkrankung: "Erkrankungen",
    eingriff: "Eingriffe",
    diagnostik: "Diagnostik",
    symptom: "Symptome",
    instrument: "Instrumente",
};

export function topicLabel(bereich) {
    return TOPIC_LABELS[bereich] ?? bereich;
}

export function subtopicLabel(unterbereich) {
    return SUBTOPIC_LABELS[unterbereich] ?? unterbereich;
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
