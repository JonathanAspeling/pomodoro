/**
 * @module TimerManager
 * @description Manages the core countdown timer logic and state updates.
 */

import { CONSTANTS, getState, updateState } from './constants';
import { formatTime } from './timeFormatter';

let intervalId = null;
let isRunning = false;

/**
 * Initializes and starts the countdown timer.
 * @param {number} initialDuration - The starting duration in seconds.
 */
export function startTimer(initialDuration) {
    if (isRunning) {
        console.warn("Timer is already running. Please stop it first.");
        return;
    }

    // 1. Update global state to reflect the new timer run
    updateState('FOCUS', initialDuration); // Assuming we start with a focus session for simplicity here
    
    let remainingTime = initialDuration;
    const displayElement = document.getElementById('timer-display');
    if (!displayElement) {
        console.error("Timer display element not found!");
        return;
    }

    // Clear any existing interval just in case
    if (intervalId !== null) {
        clearInterval(intervalId);
    }

    // 2. Set up the countdown interval
    intervalId = setInterval(() => {
        remainingTime--;
        const formattedTime = formatTime(remainingTime);
        displayElement.textContent = formattedTime;

        if (remainingTime <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            isRunning = false;
            handleTimerEnd();
        }
    }, 1000);

    isRunning = true;
    console.log("Timer started successfully.");
}

/**
 * Pauses the timer without changing its state.
 */
export function pauseTimer() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        isRunning = false;
        console.log("Timer paused.");
    }
}

/**
 * Resumes the timer from its current remaining time.
 */
export function resumeTimer() {
    if (getState().remainingTimeSeconds > 0 && !isRunning) {
        startTimer(getState().remainingTimeSeconds);
    } else if (getState().remainingTimeSeconds === 0) {
        console.warn("Cannot resume: Timer is already at zero.");
    }
}

/**
 * Handles the logic when the timer reaches zero.
 */
function handleTimerEnd() {
    // This function should trigger UI/UX alerts and state transitions (TASK-9 dependency).
    console.log("=============================");
    console.warn("!!! TIME UP !!!");
    console.log("Triggering 'Time Up' event for next session transition.");
    console.log("=============================");

    // In a full implementation, this would dispatch an event: 
    // document.dispatchEvent(new CustomEvent('timer-ended', { detail: getState().currentSessionType }));
}

/**
 * Clears the timer and resets the display to initial state (or zero).
 */
export function clearTimer() {
    pauseTimer();
    document.getElementById('timer-display').textContent = formatTime(getState().remainingTimeSeconds);
    console.log("Timer cleared.");
}

// Expose a simple test function for manual testing
export function getIntervalId() {
    return intervalId;
}