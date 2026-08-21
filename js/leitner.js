export const MASTERED_BOX = 5;

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
