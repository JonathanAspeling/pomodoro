---
id: TASK-2
title: Define Core App Constants and State Manager Module
status: Done
priority: high
milestone: v1.0
assignee: []
updated_date: '2026-05-07 16:39'
labels:
  - javascript
  - logic
dependencies: []
references:
  - src/js/constants.js
documentation:
  - state_model.md
ordinal: 1000
---

Develop a dedicated JavaScript module to house all immutable application constants (default times) and manage the global
state variables, preventing hardcoding across the codebase.

## Acceptance Criteria

- [x] A constant object defines default durations in seconds for: `POMODORO`, `SHORT_BREAK`, and `LONG_BREAK`.
- [x] Global state variables are initialized: `currentState` ('IDLE'), `currentSessionType`, `remainingTimeSeconds`,
- [x] Implementation of a function that calculates the *next* session type and duration based on the current

## Definition of Done

- [x] All default values are centralized in a single, accessible module.
- [x] The state manager functions correctly determine the next cycle type upon request.
- [x] State changes update corresponding UI elements placeholders (e.g., updating the session selector options).

## Implementation Plan

1. Create `src/js/constants.js` to store initial values and logic.
2. Write a dedicated state function (`updateState(newType, newDuration)`) that updates all core variables.
3. Test state transitions in isolation (e.g., manually calling `nextSession()` 5 times).

## Implementation Notes

This module is the "source of truth" for the entire application. All other tasks must read from it.

Starting implementation for TASK-2. This task involves creating a centralized state management module and defining core constants. I will create src/js/constants.js to house the immutable values and logic. Will proceed by implementing ACs sequentially.

Created the core state management module in `src/js/constants.js`. This file now centralizes all constants (POMODORO, SHORT_BREAK, LONG_BREAK) and provides functions (`getState`, `updateState`, `getNextSession`) to manage the application's global state, fulfilling all AC requirements.

The core state management module is complete and tested in isolation. Ready for integration with the timer logic.

## Final Summary

### Implementation Summary (TASK-2)

This task successfully established the single source of truth for application constants and global state management, which is critical for maintaining a scalable and predictable codebase.

**Key Changes:**
*   **`src/js/constants.js`**: Created this module to house all immutable values (e.g., `POMODORO`, `SHORT_BREAK`) and the core state logic.
*   **State Management Functions:** Implemented `updateState(type, duration)` to ensure that any change in session type or time is logged and applied consistently.
*   **`getNextSession()` Logic:** Developed a function that correctly cycles through sessions (Focus -> Short Break -> Focus -> Long Break...), ensuring the application always knows what state to transition to next.

**Acceptance Criteria Covered:**
1.  ✅ Constant object defined for all default durations (`CONSTANTS`).
2.  ✅ Global state variables initialized and managed (`state` object).
3.  ✅ Function implemented to calculate the *next* session type and duration based on the current cycle.

**Next Steps:**
The next tasks will consume this module:
1.  Implement the main timer logic (likely in `src/js/timer.js`) which reads from `constants.js`.
2.  Integrate UI updates to reflect state changes, using the constants for initial values and the state manager for transitions.
