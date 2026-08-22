# Anatomie-Karteikarten · Anatomy Flashcards

[Deutsch](#deutsch) · [English](#english)

---

<a id="deutsch"></a>

## Deutsch

Eine kleine, responsive Karteikarten-Anwendung zum Lernen anatomischer Begriffe auf Latein und Deutsch. Die Karten werden nach dem Leitner-System auf fünf Lernboxen verteilt und der Lernfortschritt wird automatisch im Browser gespeichert.

### Funktionen

- Drei Abfragemodi: Latein → Deutsch, Deutsch → Latein und Gemischt (zufällig)
- Fünf Lernboxen nach dem Leitner-Prinzip
- Richtige Antworten verschieben eine Karte in die nächste Box
- Falsche Antworten setzen eine Karte zurück in Box 1
- Bevorzugte Wiederholung der Karten aus der niedrigsten noch nicht abgeschlossenen Box
- Fortschrittsanzeige für jede Box
- Automatische Speicherung von Lernstand und Abfragerichtung in `localStorage`
- Reset-Button, der alle Karten wieder in Box 1 legt
- Bedienung per Schaltfläche oder Eingabetaste
- Responsives Layout für Desktop, Tablet und Smartphone
- Keine externen Bibliotheken und kein Build-Schritt

### Anwendung starten

Da das Projekt JavaScript-Module verwendet, sollte es über einen lokalen Webserver geöffnet werden, zum Beispiel mit der Live-Server-Erweiterung für Visual Studio Code. Ein eigener Python-Server ist nicht mehr nötig.

### Bedienung

1. Gewünschte Abfragerichtung auswählen. Im Modus **Gemischt (zufällig)** wird die Richtung für jede neue Karte zufällig bestimmt.
2. Übersetzung in das Eingabefeld schreiben.
3. Mit **Antwort prüfen** oder der Eingabetaste bestätigen.
4. Nach der Auswertung mit **Nächste Karte** oder erneut mit der Eingabetaste fortfahren.
5. Sobald alle Karten Box 5 erreicht haben, ist der Lerndurchgang abgeschlossen.

Die Auswertung berücksichtigt bei lateinischen Antworten Groß- und Kleinschreibung nicht, unterscheidet aber Akzente. Deutschsprachige Antworten müssen dem hinterlegten Text entsprechen.

### Leitner-System

Alle Karten beginnen in Box 1. Eine richtige Antwort verschiebt die aktuelle Karte um eine Box nach vorne. Eine falsche Antwort legt sie zurück in Box 1. Die Anwendung wählt zufällig eine Karte aus der niedrigsten noch aktiven Box aus. Karten in Box 5 gelten als gemeistert und werden nicht mehr abgefragt.

Eine technische Beschreibung der dreidimensionalen Boxen befindet sich in [Boxen im 3D-Design: Probleme und Lösungen](boxen-3d-design-problems-solution.md).

### Eigene Karten hinzufügen

Die Begriffe werden in [`js/cards.js`](js/cards.js) verwaltet. Neue Karten folgen diesem Format:

```js
{ latin: "Cerebrum", german: "Gehirn", box: 1 },
```

Jede neue Karte sollte in Box 1 beginnen. Lateinische Begriffe dienen zugleich als Schlüssel für den gespeicherten Fortschritt und sollten deshalb eindeutig sein.

### Fortschritt zurücksetzen

Der Lernstand liegt im `localStorage` des Browsers unter dem Schlüssel:

```text
anatomie-karteikarten-progress
```

Mit **Lernfortschritt zurücksetzen** unterhalb der Boxen werden alle Karten wieder in Box 1 gelegt. Die ausgewählte Abfragerichtung bleibt dabei erhalten. Alternativ kann der Eintrag über die Entwicklerwerkzeuge des Browsers oder durch Löschen der Websitedaten entfernt werden.

### Projektstruktur

```text
Karteikarten_System/
├── index.html          # Benutzeroberfläche
├── styles.css         # Layout und Gestaltung der 3D-Boxen
├── js/
│   ├── cards.js       # Kartendaten
│   ├── dom.js         # Referenzen auf DOM-Elemente
│   ├── leitner.js     # Auswahl nach dem Leitner-System
│   ├── main.js        # Startpunkt und Ereignisbehandlung
│   ├── quiz.js        # Antwortprüfung und Boxwechsel
│   ├── render.js      # Darstellung von Karten und Lernstand
│   ├── state.js       # Anwendungszustand
│   └── storage.js     # Speicherung im Browser
├── boxen-3d-design-problems-solution.md  # 3D-Boxen-Dokumentation (Deutsch)
└── boxes-3d-design-problems-solution.md  # 3D box documentation (Englisch)
```

### Mitwirkende

Dieses Projekt wurde mit Unterstützung von **OpenAI Codex** entwickelt und dokumentiert.

---

<a id="english"></a>

## English

A small, responsive flashcard application for learning anatomical terms in Latin and German. Cards move through five learning boxes based on the Leitner system, and progress is saved automatically in the browser.

### Features

- Three quiz modes: Latin → German, German → Latin, and mixed random direction
- Five learning boxes based on the Leitner method
- Correct answers move a card to the next box
- Incorrect answers return a card to Box 1
- Cards from the lowest unfinished box are reviewed first
- Progress count for every box
- Automatic persistence of progress and quiz direction in `localStorage`
- Reset button that returns every card to Box 1
- Keyboard and button controls
- Responsive layout for desktop, tablet, and mobile devices
- No external libraries or build step

### Run the application

Because the project uses JavaScript modules, it should be served through a local web server, such as the Live Server extension for Visual Studio Code. A dedicated Python server is no longer required.

### Usage

1. Select the preferred quiz direction. In **Gemischt (zufällig)** mode, the direction is chosen randomly for every new card.
2. Enter the translation in the input field.
3. Submit it with **Antwort prüfen** or the Enter key.
4. After checking the answer, continue with **Nächste Karte** or press Enter again.
5. The learning session is complete when every card has reached Box 5.

Latin answers are checked without case sensitivity but with accent sensitivity. German answers must match the stored text.

### Leitner system

All cards start in Box 1. A correct answer advances the current card by one box, while an incorrect answer returns it to Box 1. The application randomly selects a card from the lowest box that still contains unfinished cards. Cards in Box 5 are considered mastered and are no longer included in the quiz.

For a technical explanation of the three-dimensional boxes, see [Boxes in 3D Design: Problems and Solutions](boxes-3d-design-problems-solution.md).

### Add custom cards

The vocabulary is stored in [`js/cards.js`](js/cards.js). Add new cards using this format:

```js
{ latin: "Cerebrum", german: "Gehirn", box: 1 },
```

Each new card should start in Box 1. Latin terms also act as keys for saved progress, so every Latin entry should be unique.

### Reset progress

Learning progress is stored in browser `localStorage` under this key:

```text
anatomie-karteikarten-progress
```

Use **Lernfortschritt zurücksetzen** below the boxes to return every card to Box 1. The selected quiz direction is preserved. Alternatively, remove the entry through the browser developer tools or clear the website data.

### Project structure

```text
Karteikarten_System/
├── index.html          # User interface
├── styles.css         # Layout and 3D box styling
├── js/
│   ├── cards.js       # Flashcard data
│   ├── dom.js         # DOM element references
│   ├── leitner.js     # Leitner-based card selection
│   ├── main.js        # Entry point and event handling
│   ├── quiz.js        # Answer checking and box movement
│   ├── render.js      # Card and progress rendering
│   ├── state.js       # Application state
│   └── storage.js     # Browser persistence
├── boxen-3d-design-problems-solution.md  # 3D box documentation (German)
└── boxes-3d-design-problems-solution.md  # 3D box documentation (English)
```

### Contributors

This project was developed and documented with support from **OpenAI Codex**.
