/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @&toolkit/debug/today.ts
 * Basically: Attempt to reduce the headache of dealing with JS dates within the project.
 *
 * <=============================================================================>
 */

import {
    CorrectCurrentDate,
    TodaysDate,
    TodaysDateObject,
} from "@/types/today";

/**
 * (not funny)
 *
 * @type {Date}
 */
const reactsFunnyDate: Date = new Date();

/**
 * Gets the current day of the week, adjusted to start on Monday.
 *
 * This adjustment is necessary because the `Date.getDay()` method returns
 * 0 for Sunday and 1 for Monday, but our UI starts the week on Monday.
 * This code converts the day index so that Monday is 0, and Sunday is 6.
 *
 * Otherwise React's date handling would mess up reminders, so use this instead of `new Date().getDay()`.
 *
 * (React for real thinks it's funny to start weeks on Sunday bruh)
 * @constant {number} ADJUSTED_TODAY - The adjusted index for today with Monday as 0 and Sunday as 6.
 */
const ADJUSTED_TODAY: number =
    reactsFunnyDate.getDay() === 0 ? 6 : new Date().getDay() - 1; // Adjust Sunday to index 6, otherwise shift back by one

/**
 * Turns either a JS `Date()` or a `TodaysDateObject` into a `TodaysDate` string.
 *
 * @param {(Date | TodaysDateObject)} date
 * @returns {TodaysDate}
 */
function StringifyDate(date: Date | TodaysDateObject): TodaysDate {
    if (date instanceof Date) {
        const day: string = String(date.getDate()).padStart(2, "0");
        const month: string = String(date.getMonth() + 1).padStart(2, "0");
        const year: number = date.getFullYear();
        return `${day}/${month}/${year}`;
    } else {
        return `${date.day}/${date.month}/${date.year}`;
    }
}

/**
 * Returns current day as a string in the DD/MM/YYYY format and as an object.
 *
 * @returns {CorrectCurrentDate} An object with the date string and another object with the raw values.
 */
function GetCurrentDateCorrectly(): CorrectCurrentDate {
    return {
        string: StringifyDate(reactsFunnyDate),
        object: {
            day: reactsFunnyDate.getDate(),
            month: reactsFunnyDate.getMonth() + 1,
            year: reactsFunnyDate.getFullYear(),
        },
    };
}

/**
 * Turns a `TodaysDate` string into a JS `Date()`.
 *
 * @param {TodaysDate} date
 * @returns {Date}
 */
function JavaScriptifyTodaysDate(date: TodaysDate): Date {
    const [day, month, year] = date.split("/").map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Alters a given date, shifting it by the amount of days provided. You can pass negatives.
 *
 * @export
 * @param {TodaysDateObject} date Date to alter
 * @param {number} shift Amount of days to shift
 * @returns {TodaysDateObject} Shifted date
 */
function AlterDate(date: TodaysDateObject, shift: number): TodaysDateObject {
    /**
     * (still not funny)
     */
    const tempFunnyDate = new Date(date.year, date.month - 1, date.day);

    // should work
    tempFunnyDate.setDate(tempFunnyDate.getDate() + shift);

    return {
        day: tempFunnyDate.getDate(),
        month: tempFunnyDate.getMonth() + 1,
        year: tempFunnyDate.getFullYear(),
    };
}

/**
 * Turns `x` minutes into an "x min.", "x s.", or "x h." string.
 *
 * @param {number} minutes Minute value.
 * @returns {string} Stringified value.
 */
function StringifyMinutes(minutes: number): string {
    let duration: number;
    let word: string;

    if (minutes < 1.0) {
        duration = minutes * 60;
        word = "s.";
    } else if (minutes >= 60.0) {
        duration = minutes / 60;
        word = "h.";
    } else {
        duration = minutes;
        word = minutes === 1 ? "min." : "mins.";
    }

    return `${duration} ${word}`;
}

export {
    ADJUSTED_TODAY,
    AlterDate,
    GetCurrentDateCorrectly,
    JavaScriptifyTodaysDate,
    StringifyDate,
    StringifyMinutes,
};
