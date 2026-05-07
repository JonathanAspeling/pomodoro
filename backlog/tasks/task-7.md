---
id: TASK-7
title: "Implement Circular Time Reduction Animation (The 'Shrinking' Effect)"
status: To Do
priority: medium
milestone: v1.0
assignee: []
updated_date: '2026-05-07 16:08'
labels:
  - css
  - javascript
dependencies:
  - TASK-3
references:
  - src/js/animationUtils.js
documentation:
  - animation_spec.md
ordinal: 1000
---

The most visually complex task. Implement a CSS/JS solution that makes the solid white inner circle appear to shrink (
or "get eaten") in real-time, proportionally to the time remaining.

## Acceptance Criteria

- [ ] The size reduction animation is smooth and continuous across all durations.
- [ ] The percentage width/height of the visible white circle must perfectly track
- [ ] When the timer reaches 0, the visible area smoothly collapses to zero before the "Time Up" event triggers.

## Definition of Done

- [x] Animation is visually impressive and accurately represents time passage.
- [x] The animation logic only updates when the timer state is 'RUNNING'.

## Implementation Plan

1. Create a dedicated HTML element for the animated circle.
2. Write a JS function that, every second, calculates the percentage width/height to apply via CSS (e.g., using
   `transform: scale()` or `width`).
3. Integrate this update into the existing timer loop logic from TASK-3.

## Implementation Notes

Performance is key here; use CSS transitions and transforms where possible for smooth rendering.

## Final Summary

## Final Summary

(Written by agent upon completion)
