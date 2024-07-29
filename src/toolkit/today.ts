/**
 * Gets the current day of the week, adjusted to start on Monday.
 *
 * This adjustment is necessary because the `Date.getDay()` method returns
 * 0 for Sunday and 1 for Monday, but our UI starts the week on Monday.
 * This code converts the day index so that Monday is 0, and Sunday is 6.
 *
 * Otherwise React's date handling would mess up reminders, so use this instead of `getDay()`.
 *
 * (React for real thinks it's funny to start weeks on Sunday bruh)
 * @constant {number} adjustedToday - The adjusted index for today with Monday as 0 and Sunday as 6.
 */
const today = new Date().getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
/**
 * Today's day index, being 0 (1st index) Monday and not Sunday, so objectives are tracked correctly.
 *
 * @type {number} Today's day index
 */
export const adjustedToday: number = today === 0 ? 6 : today - 1; // Adjust Sunday to index 6, otherwise shift back by one

/**
 * Returns current day as a string in the DD/MM/YYYY format
 *
 * @returns {string} Today's date in DD/MM/YYYY format
 */
export const getCurrentDate = (): TodaysDay => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * A type for today's date string. "`{string}`/`{string}`/`{string}`"
 *
 * @export
 * @typedef {TodaysDay}
 */
export type TodaysDay = `${string}/${string}/${string}`
