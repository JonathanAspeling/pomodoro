---
id: TASK-5
title: Implement Session State Transition Logic (The Workflow Engine)
status: To Do
priority: high
milestone: v1.0
assignee: []
updated_date: '2026-05-07 16:08'
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

- [ ] When a session ends, the system automatically triggers a state change to the next defined cycle type.
- [ ] The `sessionCount` correctly increments after each successful session completion.
- [ ] Logic implements the long break rule: If (total sessions % 4) === 0 AND session count > 0, the next session must
- [ ] The system correctly handles returning to POMODORO mode after a Long Break cycle.

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

## Final Summary

## Final Summary

(Written by agent upon completion)
