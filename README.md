# NoteMath

A notebook-style calculator: work through math line by line with a running total, capture results when you want, and keep multiple notes. No build step—runs in any modern browser.

## What it does

**Notes** — The app opens to a list of your notes. Tap the **+** button (bottom-right) to create a note; tap a note to open it. Each note has its own editable title and its own rows. Delete a note from the list with the trash icon on that row. If you have no notes, the message says: *Tap the + button to create a note.*

**Default titles** — New notes get a default title like "Note 1", "Note 2", and so on. The number is the next in sequence after any existing "Note N" titles (e.g. if you have "Note 2" and "Grocery Bill", the next note is "Note 3"). You can edit any title.

**Inside a note** — Each line has an operator (+, −, ×, ÷) and an optional number. The app keeps a **running total** as you edit. Tap the operator to open a menu and change it (each has a distinct color). Turn any row into an **equals** row to lock the current total as that line’s result; you can copy the result from that row.

**Rows** — Enter adds a new row (or, in an empty field, turns the current row into a result). Backspace on an empty or result row removes that row. The last row cannot be removed. Reorder rows by dragging the grip handle (⋮⋮); this works on both desktop and touch.

**Keyboard** — Arrow up/down move between rows. Space toggles the current row between "add" and "equals". Ctrl/Cmd+Z undoes row changes; Shift+Ctrl/Cmd+Z redoes. When you open or return to a note, the last row is focused so the keyboard works right away.

## Tech stack

- **React 18** (UMD from unpkg) with **Babel** for in-browser JSX.
- **Tailwind CSS** (CDN) for layout and styling.
- Plain browser scripts split by responsibility:
  - `index.html` (UI + wiring),
  - `calculator-core.js` (parsing/evaluation/formatting),
  - `storage.js` (localStorage + import/export helpers).
- No build step. Data is stored in the browser (localStorage) and persists across sessions.

## UX details

- **List view** — Shows note title and a one-line preview (row count or last result). Back button in a note returns to the list. Header title is "NoteMath".
- **In a note** — Header has back (to list), editable title, and trash (clears all rows in that note only; does not delete the note).
- **Mobile** — Viewport meta, no number spin buttons, 44px touch targets. On phones, the number keypad has no Return key: use the floating **+** (New row) button or tap the empty space below the last row to add a line without closing the keyboard. Row dividers show where to tap.
- **Desktop** — Centered card layout with rounded corners and shadow. Drag the grip to reorder rows; keyboard shortcuts work when a row is focused.

## Math behavior

- Numbers accept comma or period as decimal separator; invalid input is treated as 0.
- Division by zero leaves the running total unchanged and marks the final result as invalid.
- Results are shown to up to 4 decimal places.

## Run locally

Open `index.html` in a browser (e.g. double-click or use a local server). No install or build required.
