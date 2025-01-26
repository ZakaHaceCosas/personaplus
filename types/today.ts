/**
 * Correct current date as both an object and a string.
 *
 * @export
 * @interface CorrectCurrentDate
 */
export interface CorrectCurrentDate {
    /**
     * String date.
     *
     * @type {TodaysDate}
     */
    string: TodaysDate;
    /**
     * Object date.
     *
     * @type {TodaysDateObject}
     */
    object: TodaysDateObject;
}

/**
 * A type for today's date string, using DD/MM/YYYY format.
 *
 * @export
 */
export type TodaysDate = `${string}/${string}/${string}`;

/**
 * An object with today's date.
 *
 * @export
 */
export type TodaysDateObject = {
    day: number;
    month: number;
    year: number;
};

/**
 * An object that stores hours, minutes, and seconds numeric values.
 *
 * @interface TimeObject
 */
export interface TimeObject {
    /**
     * Hours.
     *
     * @type {?number}
     */
    hours?: number;
    /**
     * Minutes.
     *
     * @type {?number}
     */
    minutes?: number;
    /**
     * Seconds.
     *
     * @type {?number}
     */
    seconds?: number;
}
