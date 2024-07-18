/**
 * Validates the basic user data. It accepts invalid types, as the type can be incorrect due to user interaction (e.g., entering text in a number field).
 *
 * @param {string | null} gender - The gender of the user.
 * @param {string | number | null} age - The age of the user.
 * @param {string | number | null} weight - The weight of the user.
 * @param {string | number | null} height - The height of the user.
 * @param {string | null} username - The username of the user.
 * @returns {boolean} - Returns true if all data is valid, false otherwise.
 */

export const validateBasicData = (gender: string | null, age: string | number | null, weight: string | number | null, height: string | number | null, username: string | null) => {
    let isDataValid =
        !gender ||
        age === null ||
        isNaN(Number(age)) ||
        Number(age) < 5 ||
        Number(age) > 99 ||
        weight === null ||
        isNaN(Number(weight)) ||
        Number(weight) < 15 ||
        Number(weight) > 300 ||
        height === null ||
        isNaN(Number(height)) ||
        Number(height) < 45 ||
        Number(height) > 260 ||
        !username ||
        username.trim() === "" ||
        username.trim().length < 3 ||
        username.trim().length > 40;

    isDataValid = !isDataValid

    return isDataValid
}
