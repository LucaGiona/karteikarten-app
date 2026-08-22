# Karteikarten System

## Projekt und Technik

- Die Anwendung verwendet HTML, CSS und Vanilla JavaScript mit ES-Modulen.
- Keine Frameworks, Build-Tools oder externen Abhaengigkeiten einfuehren, sofern
  die Aufgabe das nicht ausdruecklich verlangt.
- Die bestehende Aufteilung in Kartendaten, Zustand, Speicherung, Lernlogik und
  Darstellung beibehalten. Neue Logik im fachlich passenden Modul ergaenzen,
  statt sie in `main.js` oder Event-Handlern zu duplizieren.
- Es gibt genau einen Lernfortschritt pro Karte: `card.box`. Keine parallelen
  Fortschrittsfelder oder voneinander abweichenden Kartenkopien einfuehren.
- Bestehende Daten im `localStorage` nach Moeglichkeit abwaertskompatibel
  behandeln.

## CSS-Konventionen

- Elemente ueber CSS-Klassen gestalten, nicht ueber ID-Selektoren. IDs sind fuer
  den JavaScript-Zugriff mit `document.querySelector` reserviert.
- Wiederverwendbare UI-Elemente mit identischem Aussehen erhalten eine gemeinsame
  Klasse, damit ihre Darstellung zentral gepflegt wird.
- Das vorhandene responsive Layout und die visuelle Sprache der App beibehalten.

## JavaScript-Konventionen

- Lernlogik und DOM-Darstellung voneinander trennen.
- Gemeinsame Regeln, etwa Boxwechsel oder Kartenauswahl, zentral implementieren
  und in allen Lernmodi wiederverwenden.
- Funktionen klein und eindeutig benennen. Kommentare nur dort verwenden, wo
  die Absicht nicht direkt aus dem Code hervorgeht.
- Bei neuen DOM-Elementen die Referenzen zentral in `js/dom.js` ablegen.
- Den Anwendungszustand in `js/state.js` verwalten und persistente Aenderungen
  ueber die bestehende Speicherlogik sichern.

## Testing

- Es gibt derzeit kein automatisiertes Test-Setup. Nach Aenderungen mindestens
  einen Syntaxcheck der betroffenen JavaScript-Dateien durchfuehren.
- UI-Aenderungen und Lernablaeufe nach Moeglichkeit im Browser pruefen.
- Besonders testen: richtige und falsche Antworten, Boxgrenzen 1 und 5,
  Abfragerichtungen, Moduswechsel, leere Kartenauswahl, Zuruecksetzen und erneutes
  Laden des gespeicherten Fortschritts.
- Falls automatisierte Tests eingefuehrt werden, diese Dokumentation entsprechend
  aktualisieren und die relevanten Tests vor der Uebergabe ausfuehren.

## Git-Workflow

- Bestehende, nicht zur Aufgabe gehoerende Aenderungen des Users nicht
  ueberschreiben oder zuruecksetzen.
- Nur auf ausdruecklichen Wunsch des Users einen Branch erstellen oder committen.
- Commit-Messages auf Englisch, kurz und im Imperativ formulieren, zum Beispiel
  `Add weekly learning mode`.
- Branch-Namen folgen `feature/<short-description>` oder
  `fix/<short-description>` in englischem Kebab-Case.
