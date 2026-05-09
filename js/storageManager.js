import { DEFAULT_DURATIONS, DEFAULT_SETTINGS } from './constants.js';

const KEYS = {
    focus: 'pomodoro_focus',
    short: 'pomodoro_short',
    long: 'pomodoro_long',
};

const SETTINGS_KEY = 'pomodoroSettings';

function clampDuration(value) {
    const n = parseInt(value, 10);
    return Number.isFinite(n) && n >= 1 && n <= 60 ? n : null;
}

export function loadDurations() {
    try {
        return {
            focus: clampDuration(localStorage.getItem(KEYS.focus)) ?? DEFAULT_DURATIONS.focus,
            short: clampDuration(localStorage.getItem(KEYS.short)) ?? DEFAULT_DURATIONS.short,
            long:  clampDuration(localStorage.getItem(KEYS.long))  ?? DEFAULT_DURATIONS.long,
        };
    } catch {
        return { ...DEFAULT_DURATIONS };
    }
}

export function saveDurations({ focus, short, long }) {
    const f = clampDuration(focus), s = clampDuration(short), l = clampDuration(long);
    try {
        if (f) localStorage.setItem(KEYS.focus, f);
        if (s) localStorage.setItem(KEYS.short, s);
        if (l) localStorage.setItem(KEYS.long, l);
    } catch {}
    return { valid: !!(f && s && l), focus: f, short: s, long: l };
}

export function loadSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
        return { ...DEFAULT_SETTINGS, ...saved };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
}
