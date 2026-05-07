/**
 * @module TimeFormatter
 * @description Utility functions for time manipulation and formatting.
 */

/**
 * Formats a total number of seconds into MM:SS string format.
 * @param {number} totalSeconds - The total duration in seconds.
 * @returns {string} The formatted time string (MM:SS).
 */
export function formatTime(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Pad with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}