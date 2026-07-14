import { loadDurations, saveDurations, loadSettings, saveSettings } from './storageManager.js';
import { SESSION_ORDER, SESSION_CONFIG, DEFAULT_SETTINGS } from './constants.js';
import { resizeCanvas, drawSweep, generateTicks, updateTickVisibility } from './clockFace.js';
import { renderDots, updateDots } from './dots.js';
import { playFeedback, playTicking, stopTicking } from './audio.js';
import { showNotification } from './notifications.js';
import { initSettingsPage, openSettings } from './settingsPage.js';
import { updateFavicon, resetFavicon } from './favicon.js';

// --- State ---
let durations = { focus: 25, short: 5, long: 15 };
let appSettings = { ...DEFAULT_SETTINGS };
let currentSession = 'focus';
let completedPomodoros = 0;

// Timer state
let animFrameId = null;
let completionTimeoutId = null;
let displayIntervalId = null;
let runStartTime = null;
let runStartRemaining = 0;
let remainingSeconds = 0;
let totalSeconds = 0;

// DOM refs (populated in setup)
let canvas, clockFaceEl, timeCircle, dotContainer, idleLabel, runningDisplay, resetButton, playButton;

// --- Formatting ---
const pad = n => String(n).padStart(2, '0');
const formatTime = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

// --- Theme & rendering ---
function applyTheme(color) {
    document.documentElement.style.setProperty('--bg-color', color);
}

function redrawCanvas() {
    if (timeCircle.classList.contains('running')) return; // rAF will redraw
    const paused = timeCircle.classList.contains('paused');
    const remaining = paused ? remainingSeconds : 0;
    drawSweep(canvas, remaining, totalSeconds, appSettings.color);
    updateTickVisibility(clockFaceEl, paused ? remainingSeconds : totalSeconds, totalSeconds);
}

// --- Session management ---
function applySession(type) {
    currentSession = type;
    const cfg = SESSION_CONFIG[type];
    totalSeconds = durations[cfg.key] * 60;
    remainingSeconds = totalSeconds;

    document.getElementById('session-type').textContent = cfg.label;
    document.getElementById('session-duration').textContent = `${durations[cfg.key]} MIN`;
    document.getElementById('running-session-name').textContent = cfg.label;
    document.getElementById('running-time').textContent = formatTime(remainingSeconds);
    drawSweep(canvas, 0, totalSeconds, appSettings.color);
    generateTicks(clockFaceEl, durations[cfg.key]);
    updateTickVisibility(clockFaceEl, totalSeconds, totalSeconds);
}

const MODE_ANIM_CLASSES = ['mode-anim-out-down', 'mode-anim-in-down', 'mode-anim-out-up', 'mode-anim-in-up'];
let modeFadingId = null;
function cycleSession(direction = 1) {
    if (animFrameId || completionTimeoutId) return;
    const len = SESSION_ORDER.length;
    const next = SESSION_ORDER[(SESSION_ORDER.indexOf(currentSession) + direction + len) % len];
    const modeText = idleLabel.querySelector('.mode-text');
    if (!modeText) { applySession(next); return; }
    if (modeFadingId) { clearTimeout(modeFadingId); modeFadingId = null; }

    const outClass = direction > 0 ? 'mode-anim-out-down' : 'mode-anim-out-up';
    const inClass = direction > 0 ? 'mode-anim-in-down' : 'mode-anim-in-up';

    modeText.classList.remove(...MODE_ANIM_CLASSES);
    void modeText.offsetWidth; // restart animation if mid-flight
    modeText.classList.add(outClass);

    modeFadingId = setTimeout(() => {
        modeText.classList.remove(outClass);
        applySession(next);
        void modeText.offsetWidth;
        modeText.classList.add(inClass);
        modeFadingId = null;
    }, 180);
}

function handleSessionComplete() {
    const finished = currentSession;
    let next;
    if (currentSession === 'focus') {
        completedPomodoros++;
        updateDots(dotContainer, completedPomodoros);
        next = (completedPomodoros % appSettings.pomodorosUntilLongBreak === 0) ? 'longBreak' : 'shortBreak';
    } else {
        if (currentSession === 'longBreak' && completedPomodoros >= appSettings.dailyGoal) {
            completedPomodoros = 0;
            updateDots(dotContainer, 0);
        }
        next = 'focus';
    }
    applySession(next);

    if (appSettings.showNotification) {
        showNotification(
            `${SESSION_CONFIG[finished].label} complete`,
            `Up next: ${SESSION_CONFIG[next].label}`
        );
    }

    const shouldAutostart = (next !== 'focus' && appSettings.autostartBreaks) ||
                            (next === 'focus' && appSettings.autostartPomodoros);
    if (shouldAutostart) startTimer();
    else setIdleState();
}

// --- UI state ---
function setIdleState() {
    timeCircle.classList.remove('running', 'paused');
    playButton.innerHTML = '&#9654;';
    playButton.setAttribute('aria-label', 'Play');
    resetButton.classList.add('invisible');
    idleLabel.classList.remove('invisible');
    runningDisplay.classList.add('invisible');
    document.title = 'Pomodoro Timer';
    resetFavicon();
}

function setActiveState(isPlaying) {
    if (isPlaying) {
        timeCircle.classList.add('running');
        timeCircle.classList.remove('paused');
    } else {
        timeCircle.classList.add('paused');
        timeCircle.classList.remove('running');
        playButton.innerHTML = '&#9208;';
        playButton.setAttribute('aria-label', 'Resume');
    }
    resetButton.classList.remove('invisible');
    idleLabel.classList.add('invisible');
    runningDisplay.classList.remove('invisible');
}

// --- Timer controls ---
function startTimer() {
    if (animFrameId || remainingSeconds <= 0) return;
    setActiveState(true);
    if (appSettings.tickingSound) playTicking();

    runStartTime = performance.now();
    runStartRemaining = remainingSeconds;
    let lastShownSecond = Math.ceil(remainingSeconds);
    const runningTimeEl = document.getElementById('running-time');

    completionTimeoutId = setTimeout(() => {
        completionTimeoutId = null;
        if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
        if (displayIntervalId) { clearInterval(displayIntervalId); displayIntervalId = null; }
        remainingSeconds = 0;
        runningTimeEl.textContent = formatTime(0);
        drawSweep(canvas, 0, totalSeconds, appSettings.color);
        stopTicking();
        playFeedback({ sound: appSettings.sound });
        handleSessionComplete();
    }, remainingSeconds * 1000);

    if (displayIntervalId) { clearInterval(displayIntervalId); displayIntervalId = null; }
    displayIntervalId = setInterval(() => {
        if (!document.hidden) return;
        const current = Math.max(0, runStartRemaining - (performance.now() - runStartTime) / 1000);
        const shownSecond = Math.ceil(current);
        document.title = `${formatTime(shownSecond)} · ${SESSION_CONFIG[currentSession].label}`;
        updateFavicon(shownSecond, totalSeconds, appSettings.color);
        document.getElementById('running-time').textContent = formatTime(shownSecond);
    }, 1000);

    function frame(now) {
        const elapsed = (now - runStartTime) / 1000;
        const current = Math.max(0, runStartRemaining - elapsed);

        drawSweep(canvas, current, totalSeconds, appSettings.color);
        updateTickVisibility(clockFaceEl, current, totalSeconds);

        const shownSecond = Math.ceil(current);
        if (shownSecond !== lastShownSecond) {
            lastShownSecond = shownSecond;
            runningTimeEl.textContent = formatTime(shownSecond);
            document.title = `${formatTime(shownSecond)} · ${SESSION_CONFIG[currentSession].label}`;
            updateFavicon(shownSecond, totalSeconds, appSettings.color);
        }

        if (current > 0) {
            animFrameId = requestAnimationFrame(frame);
        } else {
            animFrameId = null;
        }
    }

    animFrameId = requestAnimationFrame(frame);
}

function pauseTimer() {
    if (!animFrameId && !completionTimeoutId) return;
    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
    if (completionTimeoutId) { clearTimeout(completionTimeoutId); completionTimeoutId = null; }
    if (displayIntervalId) { clearInterval(displayIntervalId); displayIntervalId = null; }
    const elapsed = (performance.now() - runStartTime) / 1000;
    remainingSeconds = Math.max(0, runStartRemaining - elapsed);
    stopTicking();
    setActiveState(false);
    document.title = `${formatTime(Math.ceil(remainingSeconds))} · ${SESSION_CONFIG[currentSession].label}`;
    updateFavicon(remainingSeconds, totalSeconds, appSettings.color);
}

function resetTimer() {
    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
    if (completionTimeoutId) { clearTimeout(completionTimeoutId); completionTimeoutId = null; }
    if (displayIntervalId) { clearInterval(displayIntervalId); displayIntervalId = null; }
    stopTicking();
    applySession(currentSession);
    setIdleState();
}

// --- Init ---
function setup() {
    appSettings = loadSettings();
    durations = loadDurations();

    canvas = document.getElementById('sweep-canvas');
    clockFaceEl = document.querySelector('.clock-face');
    timeCircle = document.getElementById('time-circle');
    dotContainer = document.querySelector('.dot-selectors');
    idleLabel = document.getElementById('idle-label');
    runningDisplay = document.getElementById('running-display');
    resetButton = document.getElementById('reset-button');
    playButton = document.getElementById('play-button');

    applyTheme(appSettings.color);

    requestAnimationFrame(() => {
        resizeCanvas(canvas, timeCircle);
        renderDots(dotContainer, appSettings.dailyGoal, appSettings.pomodorosUntilLongBreak);
        applySession('focus');
        setIdleState();
    });

    // Timer interactions
    timeCircle.addEventListener('click', () => {
        if (animFrameId || completionTimeoutId) pauseTimer(); else startTimer();
    });
    idleLabel.addEventListener('click', e => {
        if (e.target.closest('.mode-stepper')) return;
        cycleSession(1);
    });
    document.getElementById('mode-prev').addEventListener('click', e => {
        e.stopPropagation();
        cycleSession(-1);
    });
    document.getElementById('mode-next').addEventListener('click', e => {
        e.stopPropagation();
        cycleSession(1);
    });
    resetButton.addEventListener('click', resetTimer);

    // Settings page
    document.getElementById('menu-button').addEventListener('click', openSettings);
    initSettingsPage({
        getDurations: () => durations,
        getSettings: () => appSettings,
        onColorChange: color => {
            appSettings.color = color;
            saveSettings(appSettings);
            applyTheme(color);
            redrawCanvas();
        },
        onSoundChange: sound => {
            appSettings.sound = sound;
            saveSettings(appSettings);
        },
        onDurationChange: (key, value) => {
            durations[key] = value;
            saveDurations(durations);
            if (!animFrameId) applySession(currentSession);
        },
        onPrefChange: (key, value) => {
            appSettings[key] = value;
            saveSettings(appSettings);
            if (key === 'pomodorosUntilLongBreak' || key === 'dailyGoal') {
                renderDots(dotContainer, appSettings.dailyGoal, appSettings.pomodorosUntilLongBreak);
                updateDots(dotContainer, completedPomodoros);
            }
            if (key === 'tickingSound') {
                if (value && animFrameId) playTicking();
                else stopTicking();
            }
        },
    });

    window.addEventListener('resize', () => {
        resizeCanvas(canvas, timeCircle);
        redrawCanvas();
        generateTicks(clockFaceEl, durations[SESSION_CONFIG[currentSession].key]);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden || !completionTimeoutId) return;
        const current = Math.max(0, runStartRemaining - (performance.now() - runStartTime) / 1000);
        const shownSecond = Math.ceil(current);
        document.getElementById('running-time').textContent = formatTime(shownSecond);
        document.title = `${formatTime(shownSecond)} · ${SESSION_CONFIG[currentSession].label}`;
        updateFavicon(shownSecond, totalSeconds, appSettings.color);
        drawSweep(canvas, current, totalSeconds, appSettings.color);
        updateTickVisibility(clockFaceEl, current, totalSeconds);
    });
}

setup();
