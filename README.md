# Pomodoro Timer

A minimalist, full-screen Pomodoro timer with customisable durations, color themes, and session tracking. No build step, no dependencies — just open `index.html`.

## Features

- **Sweep-style timer face** drawn on canvas with smooth `requestAnimationFrame` animation
- **Three session types** — Pomodoro, Short Break, Long Break — cycled automatically
- **Customisable durations** for each session type
- **20 color themes** that recolor the entire app, including the canvas
- **Daily goal & dot tracker** — visual progress dots grouped by Pomodoros-until-long-break
- **Autostart** options for breaks and Pomodoros
- **Sound preferences** — alarm, notification, or silent
- **Persistent settings** via `localStorage`

## Local development

No build tooling. Either:

```sh
# Open directly
open index.html

# Or serve with any static server (recommended for ES modules)
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project structure

```
.
├── index.html          # Entry point
├── css/style.css       # All styles
├── js/                 # ES modules
│   ├── main.js           # Orchestration & timer loop
│   ├── constants.js      # Session config, color themes, defaults
│   ├── clockFace.js      # Canvas sweep & tick marks
│   ├── dots.js           # Daily-goal dot rendering
│   ├── audio.js          # Beep + vibration feedback
│   ├── settingsPage.js   # Settings UI (color, sound, prefs)
│   └── storageManager.js # localStorage helpers
└── docs/ui/            # Reference design screenshots
```

## License

[MIT](LICENSE) © Jonathan Aspeling
