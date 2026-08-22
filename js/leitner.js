export const MASTERED_BOX = 5;

export const DAY_GROUPS = {
    DAILY: "daily",     // Mo, Mi, Fr -> Box 1
    MIDWEEK: "midweek", // Di, Do -> Box 1-4
    WEEKEND: "weekend", // Sa, So -> Box 1 + 5
};

const WEEKDAY_TO_GROUP = {
    0: DAY_GROUPS.WEEKEND, // Sonntag
    1: DAY_GROUPS.DAILY,   // Montag
    2: DAY_GROUPS.MIDWEEK, // Dienstag
    3: DAY_GROUPS.DAILY,   // Mittwoch
    4: DAY_GROUPS.MIDWEEK, // Donnerstag
    5: DAY_GROUPS.DAILY,   // Freitag
    6: DAY_GROUPS.WEEKEND, // Samstag
};

export function getTodayGroup(date = new Date()) {
    return WEEKDAY_TO_GROUP[date.getDay()];
}

export function isCardDueInGroup(card, group) {
    switch (group) {
        case DAY_GROUPS.DAILY:
            return card.box === 1;
        case DAY_GROUPS.MIDWEEK:
            return card.box >= 1 && card.box <= 4;
        case DAY_GROUPS.WEEKEND:
            return card.box === 1 || card.box === MASTERED_BOX;
        default:
            return false;
    }
}

export function pickDueCardIndex(cards, group, completedThisSession, excludeIndex = -1) {
    const candidates = cards
        .map((card, index) => ({ card, index }))
        .filter(({ card }) =>
            isCardDueInGroup(card, group) &&
            !completedThisSession.has(card.latin)
        );

    if (candidates.length === 0) {
        return -1;
    }

    const pool = candidates.length > 1
        ? candidates.filter(({ index }) => index !== excludeIndex)
        : candidates;
    const finalPool = pool.length > 0 ? pool : candidates;
    const pick = finalPool[Math.floor(Math.random() * finalPool.length)];

    return pick.index;
}

export function pickCardIndex(cards, excludeIndex = -1) {
    let lowestBox = null;

    cards.forEach(card => {
        if (
            card.box < MASTERED_BOX &&
            (lowestBox === null || card.box < lowestBox)
        ) {
            lowestBox = card.box;
        }
    });

    if (lowestBox === null) {
        return -1;
    }

    const candidates = cards
        .map((card, index) => ({ box: card.box, index }))
        .filter(candidate => candidate.box === lowestBox);
    const pool = candidates.length > 1
        ? candidates.filter(candidate => candidate.index !== excludeIndex)
        : candidates;
    const pick = pool[Math.floor(Math.random() * pool.length)];

    return pick.index;
}
