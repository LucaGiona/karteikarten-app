# Boxen im 3D-Design: Probleme und Lösungen

*[English](boxes-3d-design-problems-solution.md)*

Erklärung zu [styles.css](styles.css#L61-L115), wie die 3D-Optik der fünf Lernboxen umgesetzt ist.

## 1. Der Grundgedanke: ein Würfel aus 3 Flächen

Jede Box besteht aus drei Teilen, die zusammen einen Quader ergeben:

```
        ___________________
       /        oben       /|
      /   (::before)      / |
     /___________________/  |
     |                   |  |  ← Seite
     |      vorne        | / (::after)
     |   (.box selbst)   |/
     |___________________|
```

- **Vorderfläche** = das `.box`-Element selbst (78×78px, dunkles Quadrat mit Text)
- **Obere Fläche** = `.box::before`, ein per CSS erzeugtes Pseudo-Element
- **Seitenfläche** = `.box::after`, ebenfalls ein Pseudo-Element

Beide Pseudo-Elemente sind `position: absolute` und ragen über den Rand der eigentlichen Box hinaus (`top: -45px` schiebt die obere Fläche nach oben raus, `left: 100%` schiebt die Seitenfläche nach rechts raus).

## 2. Die Geometrie dahinter

Ein Würfel in der Skizze braucht eine "Tiefenrichtung" – gewählt wurden **60px nach rechts, 45px nach oben** (ca. 37° Winkel, ähnlich der Handskizze, die als Vorlage diente). Diese beiden Werte heißen im Folgenden `dx = 60` und `dy = 45`.

Für die **obere Fläche** gilt: sie ist ein Parallelogramm, das die Vorderkante (0 bis 78) mit der um `(dx, -dy)` verschobenen Hinterkante (60 bis 138) verbindet. Deshalb ist das `::before`-Element `138px` breit (`78 + 60`) und `45px` hoch (`= dy`).

Für die **Seitenfläche** gilt dasselbe, nur um 90° gedreht: `60px` breit (`= dx`), `123px` hoch (`78 + 45`).

## 3. Wie das SVG funktioniert

Das ist der Kern der Technik. Beispiel obere Fläche ([styles.css:100](styles.css#L100)):

```html
<svg viewBox="0 0 138 45">
  <polygon points="0,45 78,45 138,0 60,0" fill="#d6d6d6"/>
  <path d="M0,45 L78,45" stroke="#000" stroke-width="2"/>
  <path d="M78,45 L138,0 L60,0 L0,45" stroke="#000" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
</svg>
```

Das `viewBox="0 0 138 45"` sagt: "dieses Koordinatensystem ist 138×45 Einheiten groß" – und weil das Element auch 138×45px groß ist (`width`/`height` in der CSS-Regel), entspricht **1 SVG-Einheit exakt 1 Pixel**. Das macht die Zahlen direkt nachvollziehbar:

| Punkt | Bedeutung |
|---|---|
| `0,45` | vorne-links (= linke obere Ecke der Box) |
| `78,45` | vorne-rechts (= rechte obere Ecke der Box) |
| `138,0` | hinten-rechts (`78+60`, `45-45`) |
| `60,0` | hinten-links (`0+60`, `45-45`) |

Drei Elemente liegen übereinander:

1. **`<polygon>`** – nur die Füllfarbe (grau), ohne eigenen Strich
2. **erster `<path>`** – zieht die **Vorderkante** (0,45 → 78,45) mit dünnem 2px-Strich, weil die genau auf der Box-Kante liegt
3. **zweiter `<path>`** – zieht die **drei "hinteren" Kanten** (die beiden Diagonalen + die hintere Querkante) mit dickerem 3px-Strich, `round`-Enden, damit es an den Ecken nicht kantig/klobig aussieht

Das ganze SVG-Markup ist URL-encodiert (`%3C` = `<`, `%3E` = `>`, `%23` = `#`) und als `data:image/svg+xml,...`-String direkt in `background-image` eingebettet – keine externe Datei, der Browser dekodiert und rendert es beim Laden von `styles.css`.

**Warum SVG statt reinem CSS?** Ein CSS-Rechteck mit `clip-path` hätte die gleiche Form ergeben, aber sein `border` gehört zum **ganzen** (unsichtbaren) Rechteck – an der Kante, wo `clip-path` mittendurch schneidet, blieb ein kleiner Rand-Rest sichtbar (der "Zipfel"-Bug einer früheren Version). Ein `<polygon>`/`<path>` in SVG zeichnet dagegen nur exakt den Pfad, der angegeben ist – keine Überreste.

## 4. Der Rand-Fix: `outline` statt `border`

`.box` hatte ursprünglich einen `border: 2px solid #000`. Ein echter `border` wird vom Boxmodell abgezogen, wodurch der Bezugsrahmen für `position: absolute`-Kinder (`::before`/`::after`) 2px kleiner ist als die sichtbare Box. Das musste mit `+2px`/`-2px`-Korrekturen ausgeglichen werden, die bei Zoom oder krummen Fenstergrößen unterschiedlich rundeten – Ergebnis war ein weißer Spalt zwischen Vorder- und Seitenfläche bei bestimmten Fenstergrößen/Zoomstufen.

`outline` mit `outline-offset: -2px` sieht optisch identisch aus, zählt aber nicht zum Boxmodell. Dadurch brauchte es keine Korrekturwerte mehr, und Box und Flächen runden bei jeder Zoomstufe/Fenstergröße gleich.

## 5. Layout: immer 3 oben, 2 unten

[styles.css:61-69](styles.css#L61-L69) sorgt zusätzlich dafür, dass die 5 Boxen nie unausgewogen umbrechen (z.B. 4 oben + 1 einsam unten):

```css
.boxes {
    display: flex;
    gap: 66px;
    justify-content: center;
    max-width: 460px;
    margin: 12px auto 25px;
    padding: 52px 68px 6px 4px;
    flex-wrap: wrap;
}
```

`max-width: 460px` reicht rechnerisch genau für 3 Boxen pro Zeile (`3×78 + 2×66 = 366px` zzgl. Padding), eine 4. passt nicht mehr rein (`4×78 + 3×66 = 510px`). Dadurch entsteht bei 5 Boxen immer der 3-oben/2-unten-Split, zentriert durch `justify-content: center`.
