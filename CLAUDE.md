# Karteikarten System

## CSS-Konventionen

- Styling von Elementen (Buttons etc.) erfolgt über CSS-Klassen, nicht über
  ID-Selektoren in styles.css. IDs sind ausschliesslich für den JS-Zugriff
  (`document.querySelector("#...")`) reserviert.
- Wiederverwendbare UI-Elemente (z.B. Buttons mit gleichem Look in
  verschiedenen Sektionen wie "freies Lernen" und "Wochenmodus") bekommen
  eine gemeinsame Klasse (z.B. `.reset-progress-btn`), damit sie garantiert
  gleich aussehen und nur an einer Stelle angepasst werden müssen.

## Git-Workflow

- Commit-Messages werden auf Englisch geschrieben, kurz und im Imperativ
  (z.B. "Add mixed random direction option").
- Branches folgen dem Schema `feature/<kurzbeschreibung>` bzw.
  `fix/<kurzbeschreibung>` (kebab-case, Englisch), z.B. `feature/wochenmodus`.
- Wenn mehrere unabhängige Änderungen anstehen, für jede eine eigenen Branch
  erstellen statt alles auf einem Branch zu sammeln.
- Fertige, geprüfte Arbeit darf ohne Rückfrage committet werden – aber ab
  und zu nachfragen, ob das weiterhin so gewünscht ist, statt es einfach
  dauerhaft vorauszusetzen.

## Testing

- Es gibt aktuell kein automatisiertes Test-Setup. Änderungen werden manuell
  im Browser getestet.
