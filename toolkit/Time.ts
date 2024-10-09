export interface Time {
    hours?: number;
    minutes?: number;
    seconds?: number;
}

/**
 * Formats a time string, from the `{ hours?: number; minutes?: number; seconds?: number; }` object provided by `react-native-timer-picker` to a "HH:MM:SS" string.
 *
 * @param {Time} time The time object.
 * @returns {string} A formatted "HH:MM:SS" string.
 */
export function formatTimeString({ hours, minutes, seconds }: Time): string {
    const timeParts = [];

    if (hours !== undefined) {
        timeParts.push(hours.toString().padStart(2, "0"));
    }
    if (minutes !== undefined) {
        timeParts.push(minutes.toString().padStart(2, "0"));
    }
    if (seconds !== undefined) {
        timeParts.push(seconds.toString().padStart(2, "0"));
    }

    return timeParts.join(":");
}

/**
 * Converts a time string in the format "HH:MM:SS" to a Time object.
 *
 * @param {string} timeString The time string to convert.
 * @returns {Time} The corresponding Time object.
 */
export function parseTimeString(timeString: string): Time {
    const parts = timeString.split(":").map(Number);
    const time: Time = {};

    if (parts.length === 3) {
        time.hours = parts[0];
        time.minutes = parts[1];
        time.seconds = parts[2];
    } else if (parts.length === 2) {
        time.minutes = parts[0];
        time.seconds = parts[1];
    } else if (parts.length === 1) {
        time.seconds = parts[0];
    }

    return time;
}
