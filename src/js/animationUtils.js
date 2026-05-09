/**
 * @module animationUtils
 * @description Handles the calculation and application of the shrinking circle animation effect.
 */

const timeCircleElement = document.getElementById('time-circle');

/**
 * Calculates the scale factor for the inner circle based on the remaining time.
 * The function assumes a total duration (e.g., 25 minutes or 1500 seconds) and current time.
 * @param {number} currentTimeSeconds - The current elapsed time in seconds.
 * @param {number} totalDurationSeconds - The total duration of the session in seconds.
 * @returns {number} A scale factor between 1 (full circle) and 0 (collapsed).
 */
export function calculateScaleFactor(currentTimeSeconds, totalDurationSeconds) {
    if (!timeCircleElement) {
        console.error("Time circle element not found.");
        return 0;
    }

    // Calculate the remaining time percentage (1 to 0)
    const remainingRatio = Math.max(0, 1 - (currentTimeSeconds / totalDurationSeconds));
    
    // We want the scale factor to represent the *remaining* visible area.
    // If ratio is 1 (start), scale should be 1.
    // If ratio is 0 (end), scale should be 0.
    return remainingRatio;
}

/**
 * Applies the calculated scale factor and width/height transformation to the time circle element.
 * @param {number} scaleFactor - The calculated scale factor (0.0 to 1.0).
 */
export function updateTimeCircleAnimation(scaleFactor) {
    if (!timeCircleElement) return;

    // Apply CSS transform for smooth scaling effect
    timeCircleElement.style.transform = `scale(${scaleFactor})`;
    
    // Optionally, adjust width/height to ensure it always fits the parent container's dimensions 
    // while maintaining the scale transformation. Since we are using 'scale', this is usually sufficient.
}

/**
 * Resets the animation state when the timer starts or changes session.
 */
export function resetTimeCircleAnimation() {
    if (timeCircleElement) {
        timeCircleElement.style.transform = `scale(1)`;
    }
}
