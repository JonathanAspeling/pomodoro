---
id: TASK-2
title: Define Core App Constants and State Manager Module
status: To Do
priority: high
milestone: v1.0
assignee: []
updated_date: '2026-05-07 16:08'
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

- [ ] A constant object defines default durations in seconds for: `POMODORO`, `SHORT_BREAK`, and `LONG_BREAK`.
- [ ] Global state variables are initialized: `currentState` ('IDLE'), `currentSessionType`, `remainingTimeSeconds`,
- [ ] Implementation of a function that calculates the *next* session type and duration based on the current

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

## Final Summary

## Final Summary

(Written by agent upon completion)
