/**
 * Validates the basic user data. It accepts invalid types, as the type can be incorrect due to user interaction (e.g., entering text in a number field).
 *
 * @param {string | null} gender - The gender of the user.
 * @param {string | number | null} age - The age of the user.
 * @param {string | number | null} weight - The weight of the user.
 * @param {string | number | null} height - The height of the user.
 * @param {string | null } username - The username of the user.
 * @returns {boolean} - Returns true if all data is valid, false otherwise.
 */

export const validateBasicData = (gender: string | null, age: string | number | null, weight: string | number | null, height: string | number | null, username: string | null) => {
    const isDataValid =
        (gender === "male" || gender === "female") &&
        age !== null &&
        !isNaN(Number(age)) &&
        Number(age) >= 5 &&
        Number(age) <= 99 &&
        weight !== null &&
        !isNaN(Number(weight)) &&
        Number(weight) >= 15 &&
        Number(weight) <= 300 &&
        height !== null &&
        !isNaN(Number(height)) &&
        Number(height) >= 45 &&
        Number(height) <= 260 &&
        username !== null &&
        username.trim() !== "" &&
        username.trim().length >= 3 &&
        username.trim().length <= 40;

    return isDataValid
}

/**
 * An interface with the basic data of a person, required by most health calculations
 *
 * @export
 * @interface UserHealthData
 * @typedef {UserHealthData}
 */
export interface UserHealthData {
    /**
     * The age of the user
     *
     * @type {number}
     */
    age: number,
    /**
     * The weight of the user
     *
     * @type {number}
     */
    weight: number,
    /**
     * The height of the user
     *
     * @type {number}
     */
    height: number,
    /**
     * The gender of the user, must be either `"male"` or `"female"`
     *
     * @type {("male" | "female")}
     */
    gender: "male" | "female"
}

/**
 * Validates the basic user data, including only data accepted by the `UserHealthData` type. It accepts invalid types, as the type can be incorrect due to user interaction (e.g., entering text in a number field).
 *
 * @param {string | null} gender - The gender of the user.
 * @param {string | number | null} age - The age of the user.
 * @param {string | number | null} weight - The weight of the user.
 * @param {string | number | null} height - The height of the user.
 * @returns {boolean} - Returns true if all data is valid, false otherwise.
 */

export const validateBasicHealthData = (gender: string | null, age: string | number | null, weight: string | number | null, height: string | number | null) => {
    const isDataValid =
        (gender === "male" || gender === "female") &&
        age !== null &&
        !isNaN(Number(age)) &&
        Number(age) >= 5 &&
        Number(age) <= 99 &&
        weight !== null &&
        !isNaN(Number(weight)) &&
        Number(weight) >= 15 &&
        Number(weight) <= 300 &&
        height !== null &&
        !isNaN(Number(height)) &&
        Number(height) >= 45 &&
        Number(height) <= 260;

    return isDataValid
}

/**
 * An interface for all of the user's data.
 *
 * @export
 * @interface UserData
 * @typedef {UserData}
 * @extends {UserHealthData} Extends UserHealthData, which contains age, gender, height, and weight.
 */
export interface UserData extends UserHealthData {
    /**
     * The user's username
     *
     * @type {string}
     */
    username: string
}


/**
 * An interface for all of the user's settings.
 *
 * @export
 * @interface UserSettings
 * @typedef {UserSettings}
 */
export interface UserSettings {
    /**
     * The preferred language of the user, must be either `"es"` or `"en"`
     *
     * @type {("es" | "en")}
     */
    language: "es" | "en"
}
