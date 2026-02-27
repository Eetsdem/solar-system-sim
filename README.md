<!--
//================================================================
// File: README.md
// Project: solar-system-sim
// Location: /README.md
// Canon Version: 1.0
// Description:
//     Project readme for the browser-based Solar System Simulation.
//
//     Responsibilities:
//       - Explain project purpose and local usage.
//       - Provide a preliminary roadmap.
//       - Document project file structure.
//
//     Canon 1.0 changes:
//       - Initial README with setup, roadmap, and structure.
// ================================================================
-->

# Solar System Sim ☀️🪐

A browser-based, physics-driven mini solar system sandbox where you can tune the **Sun's weight (mass)** and **gravitational effect multiplier** and watch how nearby bodies react.

## Quick Start

1. Clone the repo.
2. Open `index.html` directly in your browser **or** serve the folder with a local web server.
3. Use the sliders to tune Sun properties.
4. Hit **Reset Creation Disk** to regenerate orbiting bodies with the current settings.

## Preliminary Roadmap

- [x] Build creation-disk view with Sun-centered body generation.
- [x] Add Sun mass slider.
- [x] Add Sun gravity effect slider.
- [x] Simulate Newtonian gravity in real time for generated bodies.
- [ ] Add per-body mass controls and body count controls.
- [ ] Add collision handling / accretion option.
- [ ] Add pause/step simulation tools.
- [ ] Add preset systems (calm, chaotic, binary-star-like).

## Project File Structure

```text
solar-system-sim/
├── .gitkeep
├── README.md
├── index.html
├── styles.css
└── app.js
```
