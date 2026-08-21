const STORAGE_KEY = "anatomie-karteikarten-progress";

export function loadProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveProgress(progress) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
        // z.B. Privatmodus oder Speicher voll – Fortschritt wird dann nicht gespeichert
    }
}
