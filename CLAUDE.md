# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static HTML portfolio website with no build process, no frameworks, and no dependencies. Development is just editing files and refreshing the browser.

## Development

No build, install, or dev server commands. Open `index.html` directly in a browser. There is no linting or test suite.

## Architecture

Single-page site — all content lives in `index.html` with anchor-based navigation (`#profile`, `#about`, `#experience`, `#projects`, `#contact`). Smooth scrolling is handled via CSS (`scroll-behavior: smooth`).

**Files:**
- `index.html` — all page sections and structure
- `style.css` — main styles (~427 lines)
- `mediaqueries.css` — responsive breakpoints (desktop nav hidden at ≤1200px, hamburger shown)
- `script.js` — single toggle function for the mobile hamburger menu
- `assets/` — images (PNG) and resume PDF

## Responsive Layout

Two layouts driven by a single 1200px breakpoint in `mediaqueries.css`:
- **Desktop (>1200px):** horizontal nav bar
- **Mobile/tablet (≤1200px):** hamburger menu that toggles a vertical nav overlay
