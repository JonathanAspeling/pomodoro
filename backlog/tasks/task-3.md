---
id: TASK-3
title: Implement Basic Countdown Timer Logic and Display Update
status: Done
priority: high
milestone: v1.0
assignee: []
updated_date: '2026-05-07 16:47'
labels:
  - javascript
  - timing
dependencies:
  - TASK-2
references:
  - src/js/timeFormatter.js
documentation:
  - timer_logic.md
ordinal: 1000
---

Develop the core time tracking mechanism using JavaScript's timing functions (`setInterval`). The module must accurately
decrement and format the displayed time while managing state changes upon hitting zero.

## Acceptance Criteria

- [x] A timer component is created that decrements a visible element every 1000ms (1 second).
- [x] Time formatting correctly handles rollover and padding (e.g., '09:05').
- [x] The countdown function successfully stops and triggers a "Time Up" event when `remainingTimeSeconds` reaches 0.
- [x] A helper function exists to format total seconds into MM:SS string.

## Definition of Done

- [x] Timer starts accurately from the duration provided by the state manager (TASK-2).
- [x] The timer pauses when cleared, and restarting it picks up exactly where it left off.
- [x] Time calculation is robust against edge cases (e.g., crossing day/hour boundaries, though not required for this

## Implementation Plan

1. Write the `startTimer(duration)` function that initializes and manages the timer interval.
2. Implement the time formatting helper utility.
3. Tie the "Time Up" event emitter to the countdown logic.

## Implementation Notes

This component is highly sensitive; thorough testing of timing accuracy is paramount.

Starting implementation for TASK-3. This involves creating the core countdown timer logic in JavaScript. I will create a time formatter utility and a dedicated timer module to manage state and timing accuracy. Will proceed by implementing ACs sequentially.

Created src/js/timeFormatter.js to handle time formatting (AC 2 & AC 4). Created src/js/timerManager.js which contains the core logic for starting, pausing, resuming, and stopping the timer using setInterval (AC 1 & AC 3). The module correctly reads state from TASK-2's constants manager.

The timer logic is robust and ready for integration into the main application file (`main.js`).

## Final Summary

### Implementation Summary (TASK-3)

This task implemented the core countdown timer mechanism, providing accurate time tracking and state management upon completion.

**Key Changes:**
*   **`src/js/timeFormatter.js`**: Utility module created to reliably format total seconds into a user-friendly `MM:SS` string, handling padding correctly.
*   **`src/js/timerManager.js`**: This module encapsulates the timer logic using `setInterval`. It handles starting, pausing, resuming, and crucially, detecting when time reaches zero (`handleTimerEnd`).

**Acceptance Criteria Covered:**
1.  ✅ Timer component created that decrements visible element every 1000ms (Implemented in `timerManager.js`).
2.  ✅ Time formatting correctly handles rollover and padding (Implemented in `timeFormatter.js`).
3.  ✅ Countdown function successfully stops and triggers a "Time Up" event when time reaches 0 (Implemented in `handleTimerEnd` within `timerManager.js`).
4.  ✅ Helper function exists to format total seconds into MM:SS string (`formatTime` in `timeFormatter.js`).

**Next Steps:**
The next logical step is to integrate this timer logic with the UI and state manager (TASK-2) by updating `src/js/main.js`. This will involve calling `startTimer()` when a session button is clicked, ensuring the display updates correctly based on the global state.
