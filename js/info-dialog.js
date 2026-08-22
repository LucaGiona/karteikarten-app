import * as dom from "./dom.js";

const MODE_INFO = {
    free: {
        title: "So funktioniert das freie Lernen",
        content: `
            <p>Du lernst ohne festen Zeitplan. Das System zeigt dir zuerst Karten aus der niedrigsten noch nicht abgeschlossenen Box.</p>
            <ul>
                <li>Eine richtige Antwort verschiebt die Karte eine Box weiter.</li>
                <li>Eine falsche Antwort setzt die Karte zurück in Box 1.</li>
                <li>In Box 5 gilt eine Karte als gemeistert.</li>
            </ul>
            <p>Die Lernrunde ist beendet, sobald alle Karten Box 5 erreicht haben.</p>
        `,
    },
    weekly: {
        title: "So funktioniert der Wochenmodus",
        content: `
            <p>Der Wochenmodus wählt automatisch die Karten aus, die am aktuellen Wochentag fällig sind.</p>
            <ul>
                <li>Montag, Mittwoch und Freitag: Box 1</li>
                <li>Dienstag und Donnerstag: Box 1 bis 4</li>
                <li>Samstag und Sonntag: Box 1 und 5</li>
            </ul>
            <p>Richtig beantwortete Karten sind für die heutige Runde erledigt. Falsche Antworten setzen die Karte zurück in Box 1.</p>
        `,
    },
};

function openInfoDialog(mode) {
    const info = MODE_INFO[mode];
    dom.infoDialogTitle.textContent = info.title;
    dom.infoDialogContent.innerHTML = info.content;
    dom.infoDialog.showModal();
}

export function initializeInfoDialog() {
    dom.freeModeInfoBtn.addEventListener("click", () => {
        openInfoDialog("free");
    });
    dom.weeklyModeInfoBtn.addEventListener("click", () => {
        openInfoDialog("weekly");
    });
    dom.infoDialogCloseBtn.addEventListener("click", () => {
        dom.infoDialog.close();
    });
    dom.infoDialog.addEventListener("click", event => {
        if (event.target === dom.infoDialog) {
            dom.infoDialog.close();
        }
    });
}
