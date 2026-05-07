---
id: TASK-4
title: Implement Play/Pause State Machine Logic
status: Done
priority: high
milestone: v1.0
assignee: []
updated_date: '2026-05-07 17:59'
labels:
  - javascript
  - logic
dependencies:
  - TASK-3
references:
  - src/js/stateMachine.js
documentation:
  - interaction_flow.md
ordinal: 1000
---

Manage the operational state of the application by handling user clicks on play/pause buttons and interactive elements (
the central circle). This module controls the timer lifecycle.

## Acceptance Criteria

- [x] Clicking the Play button initiates the timer interval and changes the internal app state to 'RUNNING'.
- [x] The system registers a click on the large solid white inner circle as a pause event, pausing the interval and
- [x] When in 'PAUSED' state, clicking the central circle resumes the countdown.
- [x] State transitions (IDLE $\rightarrow$ RUNNING $\rightarrow$ PAUSED) update both the UI elements and internal logic

## Definition of Done

- [x] The timer cannot be controlled if it is not running or paused (invalid transition state).
- [x] User feedback (e.g., button text change, visual highlight) confirms the current active state.

## Implementation Plan

1. Add event listeners to the main play button and the central timing area.
2. Write a master control function (`togglePlayPause()`) that checks the `currentState` before manipulating the timer
   interval.
3. Ensure proper cleanup of intervals when components are unloaded or reset.

## Implementation Notes

This task is critical for user interaction; it must feel seamless and reliable.

Implemented initial event listeners in src/js/stateMachine.js for both the Play button and the central timing area (inner circle). The master control function `togglePlayPause()` has been created to manage state transitions based on user input, fulfilling part of the plan. Initial logic checks if the timer is already running or paused before attempting a transition.

Refined the event handling in src/js/stateMachine.js. The central timing area (inner circle) now correctly registers a click as a pause event when the timer is running, pausing the interval and updating the state to 'PAUSED' (AC #2). Furthermore, clicking this inner circle while in the 'PAUSED' state now successfully resumes the countdown by calling `togglePlayPause()` again, ensuring seamless resume functionality (AC #3). The master control function now includes robust checks for invalid transition states.

Added comprehensive state update logic to src/js/stateMachine.js. The system now correctly updates both the UI elements (e.g., button text, visual highlights) and internal application state variables whenever a transition occurs (IDLE $\rightarrow$ RUNNING $\rightarrow$ PAUSED), satisfying AC #4. This ensures all parts of the application are synchronized with the current operational state.

## Final Summary

**Implemented Play/Pause State Machine Logic (TASK-4)**

This task successfully established the core operational state machine for the Pomodoro timer, managing all user interactions related to starting, pausing, and resuming the countdown. This module is critical as it controls the entire timer lifecycle and interacts with TASK-3's time events.

**Key Changes & Implementation Details:**
1.  **State Management:** The `src/js/stateMachine.js` file now houses a robust state machine that tracks the application's status (IDLE, RUNNING, PAUSED). All user interactions are funneled through a master control function (`togglePlayPause()`) which validates transitions and prevents invalid state changes.
2.  **Play Button Logic (AC #1):** Clicking the Play button correctly initiates the timer interval and updates the internal state to 'RUNNING'.
3.  **Pause/Resume Logic (AC #2 & AC #3):** The central timing area (inner circle) is now configured as a pause trigger when running, pausing the interval and setting the state to 'PAUSED'. Clicking this same area while paused correctly resumes the countdown, ensuring seamless user experience.
4.  **UI Synchronization (AC #4):** Every state transition (IDLE $\rightarrow$ RUNNING $\rightarrow$ PAUSED) triggers updates to both the UI elements (e.g., button text changes, visual highlights) and internal logic variables, guaranteeing consistency across the application.

**Testing & Verification:**
*   The system was tested thoroughly to ensure that invalid transitions are blocked, maintaining state integrity (DoD #1).
*   Visual feedback mechanisms were implemented to confirm the current active state for the user (DoD #2).

This implementation provides a reliable and intuitive control layer for the entire Pomodoro application.
