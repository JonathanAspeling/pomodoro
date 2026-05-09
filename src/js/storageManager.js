const KEYS = {
    focus: 'pomodoro_focus',
    short: 'pomodoro_short',
    long: 'pomodoro_long',
};

const DEFAULTS = { focus: 25, short: 5, long: 15 };

function clamp(value) {
    const n = parseInt(value, 10);
    return Number.isFinite(n) && n >= 1 && n <= 60 ? n : null;
}

export function loadDurations() {
    return {
        focus: clamp(localStorage.getItem(KEYS.focus)) ?? DEFAULTS.focus,
        short: clamp(localStorage.getItem(KEYS.short)) ?? DEFAULTS.short,
        long:  clamp(localStorage.getItem(KEYS.long))  ?? DEFAULTS.long,
    };
}

export function saveDurations({ focus, short, long }) {
    const f = clamp(focus), s = clamp(short), l = clamp(long);
    if (f) localStorage.setItem(KEYS.focus, f);
    if (s) localStorage.setItem(KEYS.short, s);
    if (l) localStorage.setItem(KEYS.long, l);
    return { valid: !!(f && s && l), focus: f, short: s, long: l };
}
