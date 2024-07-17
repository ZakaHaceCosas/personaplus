// Today's date

// since React for some reasons thinks it's funny to start weeks on Sunday, this needs to be done
// this basically changes the index or the getDay function to ensure we start on Monday and not on Sunday, as the UI starts with Monday and using getDay() directly would mess up reminders.
const today = new Date().getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
// Adjust today index to match week start (Monday as 0)
export const adjustedToday = today === 0 ? 6 : today - 1; // Adjust Sunday to index 6, otherwise shift back by one
