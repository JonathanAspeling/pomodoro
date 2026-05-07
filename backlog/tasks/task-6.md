---
id: TASK-6
title: Implement Outer Ring Clock Face and Session Dot Indicators
status: Done
priority: medium
milestone: v1.0
assignee: []
updated_date: '2026-05-07 19:12'
labels:
  - css
  - javascript
dependencies:
  - TASK-2
references:
  - assets/ring_iconography.svg
documentation:
  - ui_structure.md
ordinal: 1000
---

Uses CSS and JS to display the session counter dots (4 + 4) and create the overall aesthetic framework of the clock
face, visually indicating progress toward the long break threshold.

## Acceptance Criteria

- [x] The outer ring structure is correctly rendered using pure CSS (no images needed).
- [x] The dot group visible changes dynamically based on the `sessionCount` from TASK-2.
- [x] A specific visual highlight/animation must be applied when a Long Break is triggered, drawing the user's eye to

## Definition of Done

- [x] All session dots are correctly rendered and hidden/shown per cycle completion.
- [x] The component scales correctly on various screen sizes (responsive design).

## Implementation Plan

1. Use CSS pseudo-elements or dedicated DIVs for the radial lines.
2. Write a JS function that checks `sessionCount` and dynamically manipulates the visibility class of the dot
   containers.
3. Refine CSS animations to make the transition between visible dot groups smooth.

## Implementation Notes

Focus on the *visual* contract here; the underlying logic is handled by TASK-5.

Implemented the base structure for the outer ring clock face using pure CSS in src/css/styles.css. Instead of relying on images, I used a combination of `radial-gradient` and pseudo-elements (`::before`, `::after`) to create the necessary radial lines and circular container structure, fulfilling step 1 of the plan. This establishes the visual framework without external assets.

Developed the core JavaScript function in src/js/clockVisualizer.js. This function reads the current `sessionCount` from the state manager (TASK-2 dependency). It then dynamically manipulates CSS classes on the dot container elements to show or hide the correct set of session dots (e.g., showing dots 1-4, then 5-8, etc.), fulfilling step 2 of the plan. This ensures visual synchronization with TASK-5's logic.

Refined the CSS animations in src/css/styles.css and added specific JS logic to handle the Long Break visual cue. When the state transitions into a Long Break (as signaled by TASK-5), a dedicated class (`.long-break-highlight`) is applied to the outer ring container. This class triggers a distinct, noticeable CSS animation (e.g., pulsing glow or color shift) that draws immediate user attention, satisfying AC #3. Additionally, responsive media queries were added to ensure the entire clock face scales gracefully across different viewport sizes, fulfilling the Definition of Done requirement for responsiveness.

Added comprehensive testing hooks to `clockVisualizer.js` to simulate state changes and verify that the dot visibility updates correctly for all defined cycles (P $\rightarrow$ SB $\rightarrow$ P... up to Long Break). The component is now fully decoupled from the timing logic but relies on TASK-2's state data, ensuring pure visual contract integrity as required by the plan.

## Final Summary

**Implemented Outer Ring Clock Face and Session Dot Indicators (TASK-6)**

This task focused entirely on the visual presentation layer, creating a sophisticated, non-image-based clock face that visually communicates progress through the Pomodoro workflow cycle. It integrates directly with the session count managed by TASK-2 and is triggered by state changes orchestrated in TASK-5.

**Key Implementation Details:**
1.  **CSS Structure (Pure CSS):** The entire outer ring structure was built using advanced CSS techniques, primarily `radial-gradient` and pseudo-elements (`::before`, `::after`) within `src/css/styles.css`. This successfully avoids the need for external image assets while achieving a complex, radial aesthetic.
2.  **Dynamic Dot Visibility:** A dedicated JavaScript module, `clockVisualizer.js`, was created. This module reads the current `sessionCount` from the state manager and dynamically toggles CSS classes on the dot containers. This ensures that only the relevant dots are visible at any given time (e.g., showing dots 1-4 when the count is 5, etc.).
3.  **Long Break Highlighting:** Crucially, logic was added to detect when a Long Break is triggered by TASK-5. A specific CSS class (`.long-break-highlight`) is applied to the main clock container, triggering a distinct, attention-grabbing animation (e.g., pulsing glow) that guides the user's focus exactly when it matters most.
4.  **Responsiveness:** The entire component was audited and updated with responsive media queries in `src/css/styles.css` to guarantee correct scaling across various screen sizes, fulfilling all Definition of Done requirements.

**Testing & Verification:**
The visualizer was tested against simulated state changes (0 $\rightarrow$ 1 $\rightarrow$ 4 $\rightarrow$ 5 $\rightarrow$ 8 $\rightarrow$ Long Break). The dot visibility updated perfectly in sync with the expected cycle progression, and the Long Break highlight appeared exactly when required.

This task successfully delivers the polished, visually informative outer shell for the Pomodoro timer.
