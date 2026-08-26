# Kartendaten

Dieser Ordner enthält die Karteninhalte als JSON-Dateien, eine Datei pro
Bereich (z.B. `organe.json`). Die App lädt sie über `DATA_FILES` in
[js/cards.js](../js/cards.js) und führt sie zu einem gemeinsamen Kartenpool
zusammen.

## Neue Bereichs-Datei anlegen

1. `db/<bereich>.json` anlegen, Inhalt als Array von Karten (Schema siehe
   unten).
2. Den Dateinamen in `DATA_FILES` in [js/cards.js](../js/cards.js)
   ergänzen.
3. Optional: einen lesbaren Anzeigenamen für den neuen `bereich`-Wert in
   `TOPIC_LABELS` in [js/cards.js](../js/cards.js) eintragen (sonst wird der
   rohe `bereich`-Wert angezeigt, z.B. im Themen-Button und im Kontext-Badge
   über der Karte). Ein neuer `typ`-Wert braucht analog einen Eintrag in
   `CATEGORY_LABELS`.

## Kartenschema

```json
{
    "id": "cor",
    "bereich": "organe",
    "kategorie": "herz-kreislauf",
    "typ": "anatomie",
    "terms": { "de": "Herz", "la": "Cor", "en": "Heart" },
    "alternativen": { "de": [], "la": [], "en": [] },
    "erklaerung": "Muskuläres Hohlorgan, das das Blut durch den Kreislauf pumpt."
}
```

- **`id`**: Kleinbuchstaben, Ziffern, Bindestriche (`^[a-z0-9-]+$`), z.B.
  `vesica-biliaris`. Muss nur **innerhalb der eigenen Bereichs-Datei**
  eindeutig sein, nicht global – siehe unten.
- **`bereich`**: sollte dem Dateinamen entsprechen (`organe.json` →
  `"organe"`). Das ist Konvention, wird aber nicht automatisch geprüft. Die
  Oberfläche fasst `ohr.json` und `hno.json` im Fach HNO zusammen.
- **`kategorie`**: freie Gruppierung innerhalb eines Bereichs (z.B.
  `verdauung`, `nervensystem`), Kleinschreibung, Bindestrich statt
  Leerzeichen. Reines Datenfeld ohne UI-Anzeige.
- **`typ`**: z.B. `"anatomie"`, `"erkrankung"`, `"eingriff"`, `"diagnostik"`,
  `"symptom"` oder `"instrument"`. Wird vom Kategorie-Filter genutzt.
- **`terms`**: die drei Sprachvarianten. Die App unterstützt Latein↔Deutsch
  und Deutsch↔Englisch. Karten ohne englischen Begriff werden bei einer
  Englisch-Abfragerichtung automatisch ausgeblendet.
- **`alternativen`**: immer ein Array je Sprache, auch wenn leer – nie
  `null` oder weggelassen. Für akzeptierte Schreibvarianten/Synonyme
  gedacht und wird von der Antwortprüfung ausgewertet.
- **`erklaerung`**: kurzer Fließtext, der nach der Antwortprüfung angezeigt wird.

## Warum `id` nicht global eindeutig sein muss

Der Lernfortschritt wird nicht über die reine `id`, sondern über
`bereich:id` gespeichert (`cardKey()` in [js/cards.js](../js/cards.js)).
Zwei Karten mit derselben `id` in unterschiedlichen Bereichs-Dateien
(z.B. `organe.json` und `krankheiten.json`) kollidieren dadurch nicht.

## Validierung beim Laden

Anders als im Vorgänger-Projekt (dort nur `console.warn` bei unbekanntem
`bereich`) **wirft die App beim Start einen Fehler**, wenn:

- eine `id` nicht dem Format `^[a-z0-9-]+$` entspricht (z.B. Großbuchstaben
  wie `"Cor"`),
- zwei Karten im selben Bereich dieselbe `id` haben.

Damit fallen Tippfehler beim manuellen Editieren sofort auf, statt sich
später als stiller Fortschritts-Bug zu zeigen.

## Achtung beim Umbenennen

Änderst du `id` oder `bereich` einer bestehenden Karte, ändert sich auch
ihr `cardKey()` – der bisherige Lernfortschritt dieser Karte im
localStorage wird dann nicht mehr gefunden und beginnt wieder bei Box 1.
