/**
 * @module ConstantsAndStateManager
 * @description Central source of truth for all application constants and global state management logic.
 */

// --- 1. Core Application Constants (AC 1) ---
export const CONSTANTS = {
    POMODORO: 25 * 60, // 25 minutes in seconds
    SHORT_BREAK: 5 * 60, // 5 minutes in seconds
    LONG_BREAK: 15 * 60, // 15 minutes in seconds
};

/**
 * @typedef {('IDLE'|'FOCUS'|'SHORT_BREAK'|'LONG_BREAK')} SessionType
 */

// --- 2. Global State Variables (AC 2) ---
let state = {
    currentState: 'IDLE', // IDLE, FOCUS, SHORT_BREAK, LONG_BREAK
    currentSessionType: null,
    remainingTimeSeconds: CONSTANTS.POMODORO,
};

/**
 * @description Retrieves the current application state.
 * @returns {object} The current state object.
 */
export function getState() {
    return { ...state }; // Return a copy to prevent external mutation
}

/**
 * @description Updates all core global state variables.
 * @param {SessionType} type - The new session type (e.g., 'FOCUS').
 * @param {number} duration - The remaining time in seconds for the new session.
 */
export function updateState(type, duration) {
    state.currentState = type;
    state.currentSessionType = type;
    state.remainingTimeSeconds = duration;

    console.log(`[STATE UPDATE] State changed to ${type}. Time set to ${duration} seconds.`);
    // In a real application, this would trigger UI updates via an event system.
}

/**
 * @description Calculates the next session type and duration based on the current state. (AC 3)
 * @returns {{nextType: SessionType, nextDuration: number}} The calculated next session details.
 */
export function getNextSession() {
    const currentState = getState().currentState;

    if (currentState === 'IDLE') {
        // Start from Focus by default
        return { nextType: 'FOCUS', nextDuration: CONSTANTS.POMODORO };
    } 
    
    // Simple cycle logic: Focus -> Short Break -> Focus -> Long Break -> Focus...
    switch (currentState) {
        case 'FOCUS':
            // After focus, check if it's time for a long break or short break
            return { nextType: 'SHORT_BREAK', nextDuration: CONSTANTS.SHORT_BREAK };

        case 'SHORT_BREAK':
            // After short break, go back to focus
            return { nextType: 'FOCUS', nextDuration: CONSTANTS.POMODORO };

        case 'LONG_BREAK':
            // After long break, reset or start a new cycle (e.g., Focus)
            return { nextType: 'FOCUS', nextDuration: CONSTANTS.POMODORO };

        default:
            console.error("Unknown state encountered:", currentState);
            return { nextType: 'IDLE', nextDuration: 0 };
    }
}

// Exporting the initial state for testing/setup purposes
export const INITIAL_STATE = getState();