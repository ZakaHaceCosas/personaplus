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
export const adjustedToday = today === 0 ? 6 : today - 1; // Adjust Sunday to index 6, otherwise shift back by one
