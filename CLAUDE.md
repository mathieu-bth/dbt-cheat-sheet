# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A single-page static HTML cheat sheet for dbt (data build tool). No build step, no framework, no dependencies — open `index.html` directly in a browser.

## Files

- `index.html` — all markup
- `style.css` — all styles (linked from `index.html`)
- `main.js` — all JavaScript (loaded synchronously after `</header>` to apply theme before first paint)

## Architecture

### Theming

Two themes coexist via CSS custom properties:

- **Light** (default — applied when `localStorage` has no saved preference)
- **Dark** (`[data-theme="dark"]` on `<html>`)
- **Light** explicit: `[data-theme="light"]` overrides on `<html>`

The active theme is stored in `localStorage` under the key `theme`. `main.js` is loaded synchronously (no `defer`) right after `</header>` so theme is applied before first paint to avoid flash.

### JavaScript features (`main.js`)

- **Theme toggle** — reads/writes `localStorage.theme`, updates `root.dataset.theme`, swaps the button emoji and label
- **Burger menu** — toggles `.open` class on `.nav-links` and `.burger`, manages `aria-expanded`, closes on outside click or nav link click
- **Anchor copy buttons** — added via `DOMContentLoaded`; each `section[id]` gets a `.anchor-btn` appended to its `.section-title`; click copies `location.origin + location.pathname + "#" + section.id` to clipboard and briefly shows a checkmark SVG

### Syntax highlighting

Code blocks use plain `<span>` elements with short utility classes — no external library:

| Class | Token type |
|-------|-----------|
| `.kw` | SQL / Jinja keywords |
| `.fn` | Functions, Jinja tags `{{ }}` / `{% %}` |
| `.str` | Strings |
| `.cm` | Comments |
| `.ac` | Accent / CLI flags |
| `.nu` | Numbers |
| `.tg` | Tags |

### Responsive nav

- **> 768 px** — horizontal scrollable link list inside the sticky nav bar
- **≤ 768 px** — links hidden; burger button shown; `.nav-links.open` triggers a `max-height` CSS transition to reveal a vertical dropdown

### Content sections

Sections follow a consistent pattern: `<section id="…">` → `.section-title` → `.grid` of `.card` elements. Each card holds a `.card-title`, `<pre><code>` blocks, `.table-wrap > table`, or `.note` tips.

Section order (matches nav link order):

1. `#structure` — Project Structure
2. `#cli` — CLI Commands
3. `#selectors` — Selector Syntax
4. `#models` — Model Configuration
5. `#ref-source` — ref() & source()
6. `#testing` — Testing
7. `#jinja` — Jinja & Macros
8. `#incremental` — Incremental Models
9. `#yaml` — YAML / Properties
10. `#packages` — Useful Packages

### CSS component inventory

Beyond cards and code blocks, these reusable patterns exist in `style.css`:

| Selector | Purpose |
|----------|---------|
| `.grid` | Auto-fill grid, `minmax(560px, 1fr)` |
| `.grid-wide` | `grid-column: 1 / -1` — forces a card to span all columns |
| `.grid-sub` | `margin-top: 1rem` — secondary grid/card below a sibling in the same section |
| `.card-desc` | Small muted paragraph used as a card subtitle |
| `dl / dt / dd` | Two-column key-value layout (used in Jinja built-in vars card) |
| `.pills / .pill` | Flex-wrap tag pill row; `.pill.accent` for orange-highlighted pills |
| `ul.clean` | Unstyled list with `›` accent bullets |
| `.note` | Orange left-border tip callout |
| `.table-wrap` | `overflow-x: auto` wrapper for tables |
| `.anchor-btn` | Hidden-until-hover link-copy button appended to section titles |

## Security

The code must not contain security vulnerabilities. After any change to `main.js` or `index.html`, verify there are no XSS risks, unsafe DOM manipulation, or external dependencies introduced.

## Browser compatibility

The page must work correctly on Chrome and Firefox (latest versions). Avoid CSS or JS features not supported by both browsers.
