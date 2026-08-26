# Anatomie-Karteikarten · Anatomy Flashcards

[Deutsch](#deutsch) · [English](#english)

---

<a id="deutsch"></a>

## Deutsch

Eine kleine, responsive Karteikarten-Anwendung zum Lernen medizinischer Fachbegriffe auf Latein, Deutsch und Englisch. Die Anwendung enthält zwei unabhängige Leitner-Systeme – **Freies Lernen** und **Wochenmodus** –, die sich zwar dieselben Karteninhalte teilen, aber jeweils ihren eigenen Lernfortschritt (Boxenzuordnung) und Reset besitzen.

### Funktionen

- Zwei unabhängige Leitner-Systeme: Freies Lernen und Wochenmodus, jeweils mit eigenem Fortschritt
- Fach-, HNO-Unterbereichs- und Kategorie-Filter, frei kombinierbar
- Anzeige der Kartenanzahl für die jeweils aktuelle Filterauswahl
- Abfragerichtungen für Latein↔Deutsch und Deutsch↔Englisch, jeweils auch gemischt
- Fünf Lernboxen nach dem Leitner-Prinzip je System
- Richtige Antworten verschieben eine Karte in die nächste Box
- Falsche Antworten setzen eine Karte zurück in Box 1
- Bevorzugte Wiederholung der Karten aus der niedrigsten noch nicht abgeschlossenen Box
- Fortschrittsanzeige für jede Box
- Automatische Speicherung von Lernstand und Abfragerichtung in `localStorage`
- Eigener Reset-Button je System, der nur dessen Karten wieder in Box 1 legt
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

Die Auswertung ignoriert Groß- und Kleinschreibung, unterscheidet aber Akzente. Hinterlegte Synonyme und Abkürzungen werden als Alternativantworten akzeptiert.

### Leitner-System

Eine Erklärung des Leitner-Prinzips (Boxen, Wiederholungslogik, pädagogischer Hintergrund) findet sich in [Leitner-Lernsystem](Leitner-LearningSystem.md).

In dieser Anwendung wählt die Auswahl zufällig eine Karte aus der niedrigsten noch aktiven Box. Karten in Box 5 gelten als gemeistert und werden nicht mehr abgefragt. Dies gilt jeweils separat für **Freies Lernen** (oberer Bereich) und **Wochenmodus** (unterer Bereich) – jede Karte hat in jedem der beiden Systeme ihre eigene Box-Nummer.

Eine technische Beschreibung der dreidimensionalen Boxen befindet sich in [Boxen im 3D-Design: Probleme und Lösungen](boxen-3d-design-problems-solution.md).

### Wochenmodus

Die Fälligkeitsregeln je Wochentag (Täglich/Di+Do/Wochenende) entsprechen dem Wochenmodell aus [Leitner-Lernsystem](Leitner-LearningSystem.md#wochenmodell).

Die Kacheln über dem Reset-Button zeigen die Anzahl der für die jeweilige Gruppe noch fälligen Karten, die aktuelle Gruppe ist hervorgehoben. Eine in dieser Sitzung bereits richtig beantwortete Karte gilt für den Rest des Tages als erledigt, auch wenn sie laut Fälligkeitsregel weiterhin fällig wäre.

### Eigene Karten hinzufügen

Die Kartendaten liegen als JSON-Dateien im Ordner [`db/`](db/), eine Datei pro Thema/Bereich (aktuell `organe.json` und `ohr.json`). Sie werden über `DATA_FILES` in [`js/cards.js`](js/cards.js) geladen und zu einem gemeinsamen Kartenpool zusammengeführt. Kartenschema, Validierungsregeln und Vorgehen für einen neuen Bereich sind in [`db/README.md`](db/README.md) beschrieben.

### Fortschritt zurücksetzen

Der Lernstand liegt im `localStorage` des Browsers unter dem Schlüssel:

```text
anatomie-karteikarten-progress
```

Freies Lernen und Wochenmodus haben je einen eigenen **Lernfortschritt zurücksetzen**-Button. Jeder Button setzt ausschliesslich die Karten des zugehörigen Systems wieder auf Box 1 zurück – das jeweils andere System bleibt unberührt. Die ausgewählte Abfragerichtung gilt für beide Systeme und bleibt bei einem Reset erhalten. Alternativ kann der gesamte Eintrag über die Entwicklerwerkzeuge des Browsers oder durch Löschen der Websitedaten entfernt werden.

### Projektstruktur

```text
Karteikarten_System/
├── index.html          # Benutzeroberfläche
├── css/
│   └── styles.css     # Layout und Gestaltung der 3D-Boxen
├── db/
│   ├── organe.json    # Kartendaten Bereich "Organe"
│   ├── ohr.json       # Kartendaten Bereich "Ohr"
│   └── README.md      # Kartenschema und Validierungsregeln
├── js/
│   ├── cards.js       # Lädt und validiert die Kartendaten aus db/
│   ├── dom.js         # Referenzen auf DOM-Elemente
│   ├── leitner.js     # Auswahl nach dem Leitner-System
│   ├── main.js        # Startpunkt und Ereignisbehandlung
│   ├── quiz.js        # Antwortprüfung und Boxwechsel
│   ├── render.js      # Darstellung von Karten und Lernstand
│   ├── state.js       # Anwendungszustand, Themen-/Kategorie-Filter
│   └── storage.js     # Speicherung im Browser
├── boxen-3d-design-problems-solution.md  # 3D-Boxen-Dokumentation (Deutsch)
├── boxes-3d-design-problems-solution.md  # 3D box documentation (Englisch)
└── Leitner-LearningSystem.md              # Erklärung des Leitner-Prinzips (DE/EN)
```

### Mitwirkende

Dieses Projekt wurde mit Unterstützung von **OpenAI Codex** entwickelt und dokumentiert.

---

<a id="english"></a>

## English

A small, responsive flashcard application for learning medical terms in Latin, German, and English. The app contains two independent Leitner systems – **free learning** and **week mode** – which share the same card content but each keep their own progress (box assignment) and reset.

### Features

- Two independent Leitner systems: free learning and week mode, each with its own progress
- Combinable subject, ENT subtopic, and category filters
- Live card count for the currently selected filter combination
- Quiz directions for Latin↔German and German↔English, each with a mixed mode
- Five learning boxes based on the Leitner method, per system
- Correct answers move a card to the next box
- Incorrect answers return a card to Box 1
- Cards from the lowest unfinished box are reviewed first
- Progress count for every box
- Automatic persistence of progress and quiz direction in `localStorage`
- Separate reset button per system that only returns that system's cards to Box 1
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

Answers are checked without case sensitivity but with accent sensitivity. Stored synonyms and abbreviations are accepted as alternatives.

### Leitner system

For an explanation of the Leitner principle (boxes, review logic, educational background), see [Leitner Learning System](Leitner-LearningSystem.md#leitner-learning-system).

In this app, selection randomly picks a card from the lowest box that still contains unfinished cards. Cards in Box 5 are considered mastered and are no longer included in the quiz. This applies separately to **free learning** (top section) and **week mode** (bottom section) – each card has its own box number in each of the two systems.

For a technical explanation of the three-dimensional boxes, see [Boxes in 3D Design: Problems and Solutions](boxes-3d-design-problems-solution.md).

### Week mode

The per-weekday due rules (daily/Tue+Thu/weekend) match the weekly model described in [Leitner Learning System](Leitner-LearningSystem.md#weekly-model).

The tiles above the reset button show how many cards are still due for each group, with the current group highlighted. A card answered correctly during the session counts as done for the rest of the day, even if the due rule would otherwise still consider it due.

### Add custom cards

Card data lives as JSON files in the [`db/`](db/) folder, one file per topic/bereich (currently `organe.json` and `ohr.json`). They are loaded via `DATA_FILES` in [`js/cards.js`](js/cards.js) and merged into a shared card pool. The card schema, validation rules, and steps for adding a new topic file are documented in [`db/README.md`](db/README.md).

### Reset progress

Learning progress is stored in browser `localStorage` under this key:

```text
anatomie-karteikarten-progress
```

Free learning and week mode each have their own **Lernfortschritt zurücksetzen** button. Each button only resets the cards of its own system back to Box 1 – the other system is left untouched. The selected quiz direction applies to both systems and is preserved on reset. Alternatively, remove the entire entry through the browser developer tools or clear the website data.

### Project structure

```text
Karteikarten_System/
├── index.html          # User interface
├── css/
│   └── styles.css     # Layout and 3D box styling
├── db/
│   ├── organe.json    # Card data for the "Organe" topic
│   ├── ohr.json       # Card data for the "Ohr" topic
│   └── README.md      # Card schema and validation rules
├── js/
│   ├── cards.js       # Loads and validates card data from db/
│   ├── dom.js         # DOM element references
│   ├── leitner.js     # Leitner-based card selection
│   ├── main.js        # Entry point and event handling
│   ├── quiz.js        # Answer checking and box movement
│   ├── render.js      # Card and progress rendering
│   ├── state.js       # Application state, topic/category filters
│   └── storage.js     # Browser persistence
├── boxen-3d-design-problems-solution.md  # 3D box documentation (German)
├── boxes-3d-design-problems-solution.md  # 3D box documentation (English)
└── Leitner-LearningSystem.md              # Explanation of the Leitner principle (DE/EN)
```

### Contributors

This project was developed and documented with support from **OpenAI Codex**.
