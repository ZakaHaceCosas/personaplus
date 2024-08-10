import { adjustedToday, getCurrentDate } from '@/src/toolkit/today';

test('should correctly adjust the day index', () => {
    // create a date for testing
    const today = new Date();
    const dayOfWeek = today.getDay();
    const expectedAdjustedToday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // verify the date is correct
    expect(adjustedToday).toBe(expectedAdjustedToday);
});

test('should return the current date in DD/MM/YYYY format', () => {
    // create a date for testing
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const expectedDate = `${day}/${month}/${year}`;

    // verify the full date is correct
    expect(getCurrentDate()).toBe(expectedDate);
});

test('should return date in the format DD/MM/YYYY', () => {
    // another test, this tests the same thing than the previous one, but using regex
    // why? idk
    const date = getCurrentDate();
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    expect(date).toMatch(regex);
});
