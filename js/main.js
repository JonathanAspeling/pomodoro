// This file should contain the main entry point for the application logic, 
// initializing event listeners and setting up the initial state of the Pomodoro timer.

import { calculateScaleFactor, updateTimeCircleAnimation, resetTimeCircleAnimation } from '../src/js/animationUtils.js';
import { loadDurations, saveDurations } from '../src/js/storageManager.js';

let currentTimerInterval = null;
let totalDurationSeconds = 0;
let elapsedTimeSeconds = 0;
let durations = { focus: 25, short: 5, long: 15 }; // Default durations in minutes

// --- Placeholder Functions (Assuming these exist and work as intended) ---
function updateTimerDisplay() { /* ... implementation for updating the clock face ... */ }
function startTimer() { /* ... implementation to start the countdown interval ... */ }
function pauseTimer() { /* ... implementation to stop the timer ... */ }
function setSession(durationSeconds) { 
    totalDurationSeconds = durationSeconds;
    elapsedTimeSeconds = 0;
    // Logic to update state and UI based on new session duration
}
// --- End Placeholder Functions ---


function setupEventListeners() {
    // 1. Play Button Listener (Assuming this exists)
    document.getElementById('play-button').addEventListener('click', () => {
        if (!currentTimerInterval) {
            startTimer();
        } else {
            pauseTimer();
        }
    });

    // 2. Session Buttons Listener (AC 4 update applied here)
    const sessionButtons = document.getElementById('session-buttons');
    sessionButtons.addEventListener('click', (e) => {
        if (!e.target.dataset.session) return;

        let duration;
        const session = e.target.dataset.session;

        // Use stored durations instead of hardcoded values
        switch(session) {
            case 'focus':    duration = durations.focus * 60; break;
            case 'shortBreak': duration = durations.short * 60; break;
            case 'longBreak':  duration = durations.long * 60; break;
        }

        setSession(duration);
        // Reset timer display and animation when session changes
        updateTimerDisplay(); 
    });


    // 3. Settings Panel Wiring (New logic added here)
    const settingsBtn = document.getElementById('settings-button');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsSave = document.getElementById('settings-save');
    const settingsCancel = document.getElementById('settings-cancel');
    const settingsError = document.getElementById('settings-error');

    // Initialize panel values on open
    settingsBtn.addEventListener('click', () => {
        document.getElementById('setting-focus').value = durations.focus;
        document.getElementById('setting-short').value = durations.short;
        document.getElementById('setting-long').value = durations.long;
        settingsError.classList.add('hidden');
        settingsPanel.classList.remove('hidden');
    });

    settingsCancel.addEventListener('click', () => {
        settingsPanel.classList.add('hidden');
    });

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


    // Initial setup call (Updated to use saved/default durations)
    const saved = loadDurations();
    if (saved && saved.focus && saved.short && saved.long) {
        durations = { focus: saved.focus, short: saved.short, long: saved.long };
    }
    setSession(durations.focus * 60); // Set initial session based on loaded/default focus time
}

setupEventListeners();
