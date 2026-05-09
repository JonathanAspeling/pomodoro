export const DEFAULT_COLOR = '#C8973A';

export const SESSION_ORDER = ['focus', 'shortBreak', 'longBreak'];

export const SESSION_CONFIG = {
    focus:      { label: 'POMODORO',    key: 'focus' },
    shortBreak: { label: 'SHORT BREAK', key: 'short' },
    longBreak:  { label: 'LONG BREAK',  key: 'long'  },
};

export const COLOR_THEMES = [
    '#D95858', '#8CC88C', '#7AB8D8', '#8888CC', '#3D2850',
    '#4CAF82', '#8A9BAD', '#7ABCB8', '#52BCAA', '#2C4868',
    '#28BCCC', '#3A7870', '#D47870', '#D49870', '#C8973A',
    '#BC3050', '#8A6845', '#A8CCDC', '#50505A', '#4ECBA0',
];

export const DEFAULT_DURATIONS = { focus: 25, short: 5, long: 15 };

export const DEFAULT_SETTINGS = {
    color: DEFAULT_COLOR,
    sound: 'alarm',
    pomodorosUntilLongBreak: 4,
    dailyGoal: 8,
    vibrate: false,
    autostartBreaks: false,
    autostartPomodoros: false,
    showNotification: false,
};
