/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @toolkit/today.ts
 * Basically: Attempt to reduce the headache of dealing with JS dates within the project.
 *
 * <=============================================================================>
 */

import { WeekTuple } from "@/types/active_objectives";
import {
    CorrectCurrentDate,
    TimeObject,
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

const TODAY_CODE_ARRAY: (keyof WeekTuple)[] = [
    "MO",
    "TU",
    "WE",
    "TH",
    "FR",
    "SA",
    "SU",
];

const ADJUSTED_TODAY_INDEX: keyof WeekTuple = TODAY_CODE_ARRAY[ADJUSTED_TODAY]!;
/**
 * Turns either a JS `Date()` or a `TodaysDateObject` into a `TodaysDate` string.
 *
 * @param {(Date | TodaysDateObject)} date
 * @returns {TodaysDate}
 */
function StringifyDate(date: Date | TodaysDateObject): TodaysDate {
    const parse: (d: string | number) => string = (
        d: string | number,
    ): string => {
        return d.toString().trim().padStart(2, "0");
    };

    if (date instanceof Date) {
        const day: string = parse(date.getDate());
        const month: string = parse(date.getMonth() + 1);
        const year: string = parse(date.getFullYear());
        return `${day}/${month}/${year}`;
    } else {
        return `${parse(date.day)}/${parse(date.month)}/${parse(date.year)}`;
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
    if (!day)
        throw new Error(
            `Attempted to JavaScriptify a day-less TodaysDate: ${date}`,
        );
    if (!month)
        throw new Error(
            `Attempted to JavaScriptify a month-less TodaysDate: ${date}`,
        );
    if (!year)
        throw new Error(
            `Attempted to JavaScriptify a year-less TodaysDate: ${date}`,
        );
    return new Date(year, month - 1, day);
}

function TurnJavaScriptDateIntoCurrentDate(date: Date): CorrectCurrentDate {
    const workingDate: Date = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );

    return {
        object: {
            day: workingDate.getDate(),
            month: workingDate.getMonth() + 1,
            year: workingDate.getFullYear(),
        },
        string: StringifyDate(workingDate),
    };
}

/**
 * Alters a given date, shifting it by the amount of days provided. You can pass negatives.
 *
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

/**
 * Formats a time string, from a `TimeObject` to a "HH:MM:SS" string.
 *
 * @param {TimeObject} time The `TimeObject`.
 * @returns {string} A formatted "HH:MM:SS" string.
 */
function formatTimeString({ hours, minutes, seconds }: TimeObject): string {
    const timeParts: string[] = [];

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
 * Converts a time string in the format "HH:MM:SS" to a `TimeObject`.
 *
 * @param {string} timeString The time string to convert.
 * @returns {TimeObject} The corresponding `TimeObject`.
 */
function parseTimeString(timeString: string): TimeObject {
    const parts: number[] = timeString.split(":").map(Number);
    if (!parts[0] || !parts[1] || !parts[2])
        throw new Error(`Invalid time string: ${timeString}`);
    const time: TimeObject = {};

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

const TimeStringUtilities = {
    Format: ({
        hours,
        minutes,
        seconds,
    }: {
        hours: number;
        minutes: number;
        seconds: number;
    }): string => {
        return formatTimeString({ hours, minutes, seconds });
    },
    Parse: (timeString: string): TimeObject => {
        return parseTimeString(timeString);
    },
};

export {
    ADJUSTED_TODAY,
    ADJUSTED_TODAY_INDEX,
    TODAY_CODE_ARRAY,
    AlterDate,
    GetCurrentDateCorrectly,
    JavaScriptifyTodaysDate,
    StringifyDate,
    StringifyMinutes,
    TurnJavaScriptDateIntoCurrentDate,
    TimeStringUtilities,
};
