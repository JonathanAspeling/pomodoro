// This file should contain the main entry point for the application logic, 
// initializing event listeners and setting up the initial state of the Pomodoro timer.

import { calculateScaleFactor, updateTimeCircleAnimation, resetTimeCircleAnimation } from '../src/js/animationUtils.js';
import { loadDurations, saveDurations } from '../src/js/storageManager.js';

let currentTimerInterval = null;
let totalDurationSeconds = 0;
let elapsedTimeSeconds = 0;
let durations = { focus: 25, short: 5, long: 15 }; // Default durations in minutes
const sessionTypes = ['focus', 'shortBreak', 'longBreak'];

// --- Placeholder Functions (Assuming these exist and work as intended) ---
function updateTimerDisplay() { /* ... implementation for updating the clock face ... */ }

/**
 * Plays a simple beep sound using the Web Audio API.
 */
function playBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
    } catch (e) { /* audio not available */ }
}

/**
 * Displays a temporary status message toast on the screen.
 * @param {string} message - The message to display.
 */
function showToast(message) {
    let toast = document.getElementById('status-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'status-toast';
        toast.style.cssText = [
            'position:fixed', 'bottom:30px', 'left:50%',
            'transform:translateX(-50%)', 'background:#333',
            'color:white', 'padding:10px 22px', 'border-radius:20px',
            'font-size:0.95em', 'opacity:0',
            'transition:opacity 0.3s', 'pointer-events:none', 'z-index:200'
        ].join(';');
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

/**
 * Updates the play/pause button icon based on timer state.
 * @param {boolean} isRunning - True if the timer is currently running.
 */
function updatePlayPauseButtonIcon(isRunning) {
    const button = document.getElementById('play-pause-button');
    if (!button) return;

    // Assuming '&#x25B6;' is Play and '&#x23ED;' is Pause (or using text symbols)
    if (isRunning) {
        button.innerHTML = '&#x23ED;'; // Pause symbol
        button.setAttribute('aria-label', 'Pause Timer');
    } else {
        button.innerHTML = '&#x25B6;'; // Play symbol
        button.setAttribute('aria-label', 'Start Timer');
    }
}


/**
 * Starts the timer countdown interval.
 */
function startTimer() {
    if (currentTimerInterval) return;

    elapsedTimeSeconds = totalDurationSeconds; // Start from full duration
    updateTimerDisplay();
    resetTimeCircleAnimation();

    currentTimerInterval = setInterval(() => {
        elapsedTimeSeconds--;
        updateTimerDisplay();

        // Check for timer end condition
        if (elapsedTimeSeconds < 0) {
            clearInterval(currentTimerInterval);
            currentTimerInterval = null;
            
            playBeep();
            showToast('Session complete! Starting next...');
            // In a real app, you would also trigger the state transition here.
        } else {
            updateTimeCircleAnimation(elapsedTimeSeconds);
        }
    }, 1000);
    updatePlayPauseButtonIcon(true); // Update icon to pause when starting
}

/**
 * Pauses the timer countdown interval.
 */
function pauseTimer() {
    if (!currentTimerInterval) return;

    clearInterval(currentTimerInterval);
    currentTimerInterval = null;
    updatePlayPauseButtonIcon(false); // Update icon to play when pausing
}


/**
 * Sets a new session duration and resets the timer state.
 * @param {number} durationSeconds - The total duration for the new session.
 */
function setSession(durationSeconds) { 
    totalDurationSeconds = durationSeconds;
    elapsedTimeSeconds = 0;
    updateTimerDisplay();
    resetTimeCircleAnimation();
    // Ensure button icon reflects paused state when changing sessions
    updatePlayPauseButtonIcon(false); 
}

/**
 * Cycles through the defined session types (Focus -> Short Break -> Long Break -> Focus).
 */
function cycleSession() {
    const currentIndex = sessionTypes.indexOf(document.getElementById('session-label').dataset.currentSession || 'focus');
    let nextIndex = (currentIndex + 1) % sessionTypes.length;
    const nextSessionType = sessionTypes[nextIndex];

    // Update the label text and dataset
    document.getElementById('session-label').textContent = nextSessionType.charAt(0).toUpperCase() + nextSessionType.slice(1).replace(/([A-Z])/g, ' $1');
    document.getElementById('session-label').dataset.currentSession = nextSessionType;

    let duration;
    switch (nextSessionType) {
        case 'focus':    duration = durations.focus * 60; break;
        case 'shortBreak': duration = durations.short * 60; break;
        case 'longBreak':  duration = durations.long * 60; break;
    }

    setSession(duration);
}


// --- End Placeholder Functions ---


function setupEventListeners() {
    const playPauseButton = document.getElementById('play-pause-button');
    const sessionLabel = document.getElementById('session-label');
    const menuButton = document.getElementById('menu-button');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsSave = document.getElementById('settings-save');
    const settingsCancel = document.getElementById('settings-cancel');
    const settingsError = document.getElementById('settings-error');

    // 1. Play/Pause Button Listener (Inside Circle)
    if (playPauseButton) {
        playPauseButton.addEventListener('click', () => {
            if (!currentTimerInterval) {
                startTimer();
            } else {
                pauseTimer();
            }
        });
    }

    // 2. Session Cycling Listener (Clicking the label below dots)
    if (sessionLabel) {
        sessionLabel.addEventListener('click', cycleSession);
    }


    // 3. Settings Panel Wiring (Hamburger Menu Button)
    if (menuButton && settingsPanel) {
        menuButton.addEventListener('click', () => {
            settingsPanel.classList.toggle('hidden');
        });
    }

    // Initialize panel values on open
    const initializeSettings = () => {
        document.getElementById('setting-focus').value = durations.focus;
        document.getElementById('setting-short').value = durations.short;
        document.getElementById('setting-long').value = durations.long;
        settingsError.classList.add('hidden');
    };

    // Settings Save/Cancel Listeners (These remain the same)
    if (settingsCancel) {
        settingsCancel.addEventListener('click', () => {
            settingsPanel.classList.add('hidden');
        });
    }

    if (settingsSave) {
        settingsSave.addEventListener('click', () => {
            const result = saveDurations({
                focus: document.getElementById('setting-focus').value,
                short: document.getElementById('setting-short').value,
                long:  document.getElementById('setting-long').value,
            });
            if (!result.valid) {
                settingsError.textContent = 'All values must be between 1 and 60.';
                settingsError.classList.remove('hidden');
                return;
            }
            // Update local durations state
            durations = { focus: result.focus, short: result.short, long: result.long };
            settingsPanel.classList.add('hidden');
        });
    }

    // Initial setup call (Updated to use saved/default durations)
    const saved = loadDurations();
    if (saved && saved.focus && saved.short && saved.long) {
        durations = { focus: saved.focus, short: saved.short, long: saved.long };
    }

    // Set initial session state and duration
    cycleSession(); 
}

setupEventListeners();
