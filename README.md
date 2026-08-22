# Anatomie-Karteikarten · Anatomy Flashcards

[Deutsch](#deutsch) · [English](#english)

---

<a id="deutsch"></a>

## Deutsch

Eine kleine, responsive Karteikarten-Anwendung zum Lernen anatomischer Begriffe auf Latein und Deutsch. Die Karten werden nach dem Leitner-System auf fünf Lernboxen verteilt und der Lernfortschritt wird automatisch im Browser gespeichert.

### Funktionen

- Abfrage in beide Richtungen: Latein → Deutsch und Deutsch → Latein
- Fünf Lernboxen nach dem Leitner-Prinzip
- Richtige Antworten verschieben eine Karte in die nächste Box
- Falsche Antworten setzen eine Karte zurück in Box 1
- Bevorzugte Wiederholung der Karten aus der niedrigsten noch nicht abgeschlossenen Box
- Fortschrittsanzeige für jede Box
- Automatische Speicherung von Lernstand und Abfragerichtung in `localStorage`
- Bedienung per Schaltfläche oder Eingabetaste
- Responsives Layout für Desktop, Tablet und Smartphone
- Keine externen Bibliotheken und kein Build-Schritt

### Anwendung starten

Da das Projekt JavaScript-Module verwendet, sollte es über einen lokalen Webserver geöffnet werden.

```bash
cd Karteikarten_System
python3 -m http.server 8000
```

Danach im Browser öffnen:

```text
http://localhost:8000
```

Alternativ kann jeder andere lokale Webserver verwendet werden, zum Beispiel die Live-Server-Erweiterung für Visual Studio Code.

### Bedienung

1. Gewünschte Abfragerichtung auswählen.
2. Übersetzung in das Eingabefeld schreiben.
3. Mit **Antwort prüfen** oder der Eingabetaste bestätigen.
4. Nach der Auswertung mit **Nächste Karte** oder erneut mit der Eingabetaste fortfahren.
5. Sobald alle Karten Box 5 erreicht haben, ist der Lerndurchgang abgeschlossen.

Die Auswertung berücksichtigt bei lateinischen Antworten Groß- und Kleinschreibung nicht, unterscheidet aber Akzente. Deutschsprachige Antworten müssen dem hinterlegten Text entsprechen.

### Leitner-System

Alle Karten beginnen in Box 1. Eine richtige Antwort verschiebt die aktuelle Karte um eine Box nach vorne. Eine falsche Antwort legt sie zurück in Box 1. Die Anwendung wählt zufällig eine Karte aus der niedrigsten noch aktiven Box aus. Karten in Box 5 gelten als gemeistert und werden nicht mehr abgefragt.

Eine technische Beschreibung der dreidimensionalen Boxen befindet sich in [boxes.md](boxes.md).

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

Zum vollständigen Neustart kann dieser Eintrag über die Entwicklerwerkzeuge des Browsers oder durch Löschen der Websitedaten entfernt werden.

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
├── boxes.md           # Technische Erklärung der Boxen (Deutsch)
└── boxes.en.md        # Technische Erklärung der Boxen (Englisch)
```

---

<a id="english"></a>

## English

A small, responsive flashcard application for learning anatomical terms in Latin and German. Cards move through five learning boxes based on the Leitner system, and progress is saved automatically in the browser.

### Features

- Quiz directions: Latin → German and German → Latin
- Five learning boxes based on the Leitner method
- Correct answers move a card to the next box
- Incorrect answers return a card to Box 1
- Cards from the lowest unfinished box are reviewed first
- Progress count for every box
- Automatic persistence of progress and quiz direction in `localStorage`
- Keyboard and button controls
- Responsive layout for desktop, tablet, and mobile devices
- No external libraries or build step

### Run the application

Because the project uses JavaScript modules, it should be served through a local web server.

```bash
cd Karteikarten_System
python3 -m http.server 8000
```

Then open the following address in a browser:

```text
http://localhost:8000
```

Any other local web server can be used as well, such as the Live Server extension for Visual Studio Code.

### Usage

1. Select the preferred quiz direction.
2. Enter the translation in the input field.
3. Submit it with **Antwort prüfen** or the Enter key.
4. After checking the answer, continue with **Nächste Karte** or press Enter again.
5. The learning session is complete when every card has reached Box 5.

Latin answers are checked without case sensitivity but with accent sensitivity. German answers must match the stored text.

### Leitner system

All cards start in Box 1. A correct answer advances the current card by one box, while an incorrect answer returns it to Box 1. The application randomly selects a card from the lowest box that still contains unfinished cards. Cards in Box 5 are considered mastered and are no longer included in the quiz.

For a technical explanation of the three-dimensional boxes, see [boxes.en.md](boxes.en.md).

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

To start over completely, remove that entry through the browser developer tools or clear the website data.

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
├── boxes.md           # Box implementation notes (German)
└── boxes.en.md        # Box implementation notes (English)
```
