# NoteMath

A notebook-style calculator that lets you work through math the way you would on paper: add, subtract, multiply, or divide line by line, watch a running total update as you go, and drop in "equals" rows whenever you want to capture a result. Single HTML file, no build—runs in any modern browser.

## What it does

- **Row-based math** — Each row has an operator (+, −, ×, ÷) and an optional number. The app maintains a **running total** and updates it as you edit.
- **Operators** — Add, subtract, multiply, divide. Tap the operator to open a menu and change it; each operator has a distinct color (e.g. orange for minus, blue for multiply).
- **Result rows** — Turn any row into an “equals” row to lock the current total as that line’s result.
- **Add/remove lines** — Enter adds a new row (or confirms a result when the field is empty). Backspace on an empty or result row removes that row. The last row cannot be deleted; clearing leaves a single empty add-row.
- **Keyboard & focus** — Arrow up/down move between rows. Space toggles between “equals” and “add”. Focus is managed so the new or previous row receives focus after add/delete.

## Tech stack

- **React 18** (UMD from unpkg) with **Babel** for in-browser JSX.
- **Tailwind CSS** (CDN) for layout and styling.
- Single **index.html** file; no build step and no other project files.

## UX details

- Mobile-friendly: viewport meta, no number spin buttons, tap highlight disabled.
- Centered card layout with rounded corners and shadow on larger screens.
- “Ghost” placeholder shows the current running total in the active empty row; a checkmark confirms and turns that row into a result.
- Header shows “Notebook” and a trash icon that clears everything back to one empty add-row.

## Math behavior

- Numbers accept comma or period as decimal separator; invalid input is treated as 0.
- Division by zero leaves the total unchanged.
- Results are formatted to up to 4 decimal places.

## Run locally

Open `index.html` in a browser (e.g. double-click or use a local server). No install or build required.
