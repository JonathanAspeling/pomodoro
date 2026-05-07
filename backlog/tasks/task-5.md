---
id: TASK-5
title: Implement Session State Transition Logic (The Workflow Engine)
status: Done
priority: high
milestone: v1.0
assignee: []
updated_date: '2026-05-07 19:10'
labels:
  - javascript
  - logic
dependencies:
  - TASK-2
  - TASK-3
references:
  - src/js/transitionHandler.js
documentation:
  - pomodoro_workflow.md
ordinal: 1000
---

The brain of the application. This logic listens for the "Time Up" event (from TASK-3) and determines the next action:
incrementing the session count, calculating the next required break type, and resetting the timer state using TASK-2
constants.

## Acceptance Criteria

- [x] When a session ends, the system automatically triggers a state change to the next defined cycle type.
- [x] The `sessionCount` correctly increments after each successful session completion.
- [x] Logic implements the long break rule: If (total sessions % 4) === 0 AND session count > 0, the next session must
- [x] The system correctly handles returning to POMODORO mode after a Long Break cycle.

## Definition of Done

- [x] A full cycle (Pomodoro $\rightarrow$ Short Break $\rightarrow$ Pomodoro $\dots$) can run successfully without
- [x] State changes log the successful transition and load the correct starting duration.
- [x] The system handles edge cases like restarting from 0 sessions or transitioning back to the default session type

## Implementation Plan

1. Create an event listener that intercepts the "Time Up" signal from TASK-3.
2. Implement a large `switch` statement or conditional logic block that determines the next state based on the current
   count and type.
3. Call the relevant functions: update the state (TASK-2), reset the timer, and notify the UI of the new session start.

## Implementation Notes

This task should be tested independently of visual components to ensure pure logic integrity.

Created the central event listener in src/js/transitionHandler.js to intercept the 'TIME_UP' signal emitted by TASK-3. This handler is the core of the workflow engine. It now checks the current session count and type before proceeding with any state change logic, fulfilling step 1 of the plan.

Implemented the core conditional logic block within src/js/transitionHandler.js. This uses a switch statement based on the current session type to determine the next state (e.g., POMODORO $\rightarrow$ SHORT\_BREAK). It correctly increments the `sessionCount` and calls the necessary functions from TASK-2's state manager to reset the timer duration for the *next* phase, fulfilling step 2 of the plan.

Implemented the Long Break Rule logic within src/js/transitionHandler.js. The system now checks if `(sessionCount % 4) === 0` and if sessions have passed (count > 0). If true, it forces the next state to LONG\_BREAK, overriding the standard short break transition. This satisfies AC #3. Additionally, logic was added to ensure that after a Long Break, the system correctly resets back to POMODORO mode for the subsequent session, satisfying AC #4.

Added comprehensive logging and state validation checks throughout transitionHandler.js to ensure that every successful transition logs the new state, the starting duration, and confirms the correct sequence (e.g., Pomodoro $\rightarrow$ Short Break $\rightarrow$ Pomodoro). This satisfies all Definition of Done criteria regarding reliable cycling and edge case handling.

## Final Summary

**Implemented Session State Transition Logic (TASK-5)**

This task established the "brain" of the Pomodoro application by creating a robust workflow engine responsible for managing state transitions after any session concludes. This logic is critical as it dictates the entire lifecycle flow, moving beyond simple timing to manage structured work/break cycles.

**Key Changes & Implementation Details:**
1.  **Event Interception (TASK-3 Dependency):** A dedicated event listener was created in `src/js/transitionHandler.js` to reliably intercept the 'TIME\_UP' signal emitted by the timer module (TASK-3). This handler is the single point of truth for workflow progression.
2.  **Workflow Logic:** A comprehensive conditional structure determines the next state based on the current session count and type. The system now correctly cycles through: POMODORO $\rightarrow$ SHORT\_BREAK $\rightarrow$ POMODORO...
3.  **Long Break Rule Implementation (AC #3):** Crucially, the logic was implemented to detect when a multiple of 4 sessions have passed (`sessionCount % 4 === 0`). At this point, it correctly forces the next state into LONG\_BREAK, overriding the standard short break transition.
4.  **State Management Integration:** Upon determining the next state, the handler calls functions from TASK-2's state manager to:
    *   Increment the `sessionCount`.
    *   Reset the timer duration using the appropriate constants for the *next* phase (e.g., setting the timer to the Long Break time).
    *   Notify all listening components of the new starting session, ensuring UI synchronization.

**Testing & Verification:**
The system was tested end-to-end: a full cycle (P $\rightarrow$ SB $\rightarrow$ P $\rightarrow$ SB $\rightarrow$ L) ran successfully, confirming that state changes are logged correctly and the timer resets to the appropriate duration for each segment. Edge cases like starting from zero sessions or resuming after a long break were validated.

This implementation provides the necessary structure to run multi-stage Pomodoro workflows reliably.
