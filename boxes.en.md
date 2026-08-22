# The Leitner Boxes: Structure and Technique

*[Deutsch](boxes.md)*

Explanation of [styles.css](styles.css#L61-L115) and how the 3D box look of the 5 Leitner boxes is implemented.

## 1. The Basic Idea: a Cube Made of 3 Faces

Each box consists of three parts that together form a cuboid:

```
        ___________________
       /        top        /|
      /   (::before)      / |
     /___________________/  |
     |                   |  |  ← side
     |      front        | / (::after)
     |   (.box itself)   |/
     |___________________|
```

- **Front face** = the `.box` element itself (78×78px, dark square with text)
- **Top face** = `.box::before`, a CSS-generated pseudo-element
- **Side face** = `.box::after`, also a pseudo-element

Both pseudo-elements are `position: absolute` and extend beyond the edge of the actual box (`top: -45px` pushes the top face upward and out, `left: 100%` pushes the side face to the right and out).

## 2. The Geometry Behind It

A cube in the sketch needs a "depth direction" – chosen here as **60px to the right, 45px up** (about a 37° angle, similar to the hand-drawn sketch that served as a template). These two values are referred to below as `dx = 60` and `dy = 45`.

For the **top face**: it is a parallelogram connecting the front edge (0 to 78) with the back edge (60 to 138), shifted by `(dx, -dy)`. That's why the `::before` element is `138px` wide (`78 + 60`) and `45px` tall (`= dy`).

The same applies to the **side face**, just rotated 90°: `60px` wide (`= dx`), `123px` tall (`78 + 45`).

## 3. How the SVG Works

This is the core of the technique. Example: the top face ([styles.css:100](styles.css#L100)):

```html
<svg viewBox="0 0 138 45">
  <polygon points="0,45 78,45 138,0 60,0" fill="#d6d6d6"/>
  <path d="M0,45 L78,45" stroke="#000" stroke-width="2"/>
  <path d="M78,45 L138,0 L60,0 L0,45" stroke="#000" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
</svg>
```

`viewBox="0 0 138 45"` says: "this coordinate system is 138×45 units in size" – and because the element is also 138×45px in size (`width`/`height` in the CSS rule), **1 SVG unit corresponds exactly to 1 pixel**. This makes the numbers directly traceable:

| Point | Meaning |
|---|---|
| `0,45` | front-left (= top-left corner of the box) |
| `78,45` | front-right (= top-right corner of the box) |
| `138,0` | back-right (`78+60`, `45-45`) |
| `60,0` | back-left (`0+60`, `45-45`) |

Three elements are layered on top of each other:

1. **`<polygon>`** – only the fill color (gray), no stroke of its own
2. **first `<path>`** – draws the **front edge** (0,45 → 78,45) with a thin 2px stroke, because it lies exactly on the box edge
3. **second `<path>`** – draws the **three "back" edges** (the two diagonals plus the back cross-edge) with a thicker 3px stroke and `round` caps, so the corners don't look jagged or clunky

The entire SVG markup is URL-encoded (`%3C` = `<`, `%3E` = `>`, `%23` = `#`) and embedded directly in `background-image` as a `data:image/svg+xml,...` string – no external file, the browser decodes and renders it when `styles.css` loads.

**Why SVG instead of pure CSS?** A CSS rectangle with `clip-path` would produce the same shape, but its `border` belongs to the **entire** (invisible) rectangle – at the edge where `clip-path` cuts through, a small leftover rim remained visible (the "tail" bug of an earlier version). A `<polygon>`/`<path>` in SVG, by contrast, draws exactly the path specified – no leftovers.

## 4. The Edge Fix: `outline` Instead of `border`

`.box` originally had a `border: 2px solid #000`. A real `border` is subtracted from the box model, which makes the reference frame for `position: absolute` children (`::before`/`::after`) 2px smaller than the visible box. That had to be compensated with `+2px`/`-2px` corrections, which rounded differently at various zoom levels or odd window sizes – resulting in a white gap between the front and side faces at certain window sizes/zoom levels.

`outline` with `outline-offset: -2px` looks visually identical but isn't counted in the box model. As a result, no correction values were needed anymore, and the box and faces round consistently at every zoom level/window size.

## 5. Layout: Always 3 on Top, 2 on the Bottom

[styles.css:61-69](styles.css#L61-L69) additionally ensures that the 5 boxes never wrap unevenly (e.g. 4 on top + 1 alone at the bottom):

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

`max-width: 460px` is calculated to fit exactly 3 boxes per row (`3×78 + 2×66 = 366px` plus padding), a 4th no longer fits (`4×78 + 3×66 = 510px`). This means that with 5 boxes, the 3-on-top/2-on-bottom split always occurs, centered via `justify-content: center`.
