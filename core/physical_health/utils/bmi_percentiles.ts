/**
 * Represents percentiles data for Body Mass Index (BMI) for individuals between 2 and 20 years of age. While for people over 20 years of age BMI calculations can be generic, for people under 20 we need to use the percentiles - which translates into turning a 300 rows Excel table into two objects
 *
 * @interface BMIPercentiles
 *
 * @property {Object<number, Object<number, number>>} data - An object where the keys are ages, and the values are objects mapping percentiles to BMI values.
 *
 * @example (this data is EXAMPLE, not real percentile data)
 * const percentiles: BMIPercentiles = {
 *     10: {
 *         5: 14.0,
 *         10: 15.0,
 *         25: 16.0,
 *         50: 17.0,
 *         75: 18.0,
 *         85: 19.0,
 *         95: 20.0
 *     },
 *     11: {
 *         5: 14.5,
 *         10: 15.5,
 *         25: 16.5,
 *         50: 17.5,
 *         75: 18.5,
 *         85: 19.5,
 *         95: 20.5
 *     }
 *     // etc etc...
 * }
 */
interface BMIPercentiles {
    /**
     * Mapping of age to percentiles data.
     *
     * @property {Object<number, number>} [age] - The age of the individual.
     * @property {number} percentile - The percentile value (e.g., 5, 10, 25, 50, 75, 85, 95).
     * @property {number} bmi - The BMI value corresponding to the given percentile.
     */
    [age: number]: {
        [percentile in 5 | 10 | 25 | 50 | 75 | 85 | 90 | 95]: number;
    };
}

/**
 * These are **NOT VALID**. Update required.
 *
 * @type {BMIPercentiles}
 */
export const MALE_PERCENTILES: BMIPercentiles = {
    2: {
        5: 14.73,
        10: 15.1,
        25: 15.76,
        50: 16.6,
        75: 17.58,
        85: 18.2,
        90: 18.6,
        95: 19.35,
    },
    3: {
        5: 14.375,
        10: 14.635,
        25: 15.34,
        50: 16,
        75: 16.81,
        85: 17.38,
        90: 17.66,
        95: 18.205,
    },
    4: {
        5: 14,
        10: 14.395,
        25: 14.96,
        50: 15.61,
        75: 16.42,
        85: 16.98,
        90: 17.26,
        95: 17.81,
    },
    5: {
        5: 13.91,
        10: 14.18,
        25: 14.66,
        50: 15.4,
        75: 16.25,
        85: 16.805,
        90: 17.21,
        95: 17.96,
    },
    6: {
        5: 13.78,
        10: 14.01,
        25: 14.6,
        50: 15.4,
        75: 16.38,
        85: 17,
        90: 17.45,
        95: 18.4,
    },
    7: {
        5: 13.75,
        10: 14.03,
        25: 14.62,
        50: 15.45,
        75: 16.6,
        85: 17.39,
        90: 18,
        95: 19.05,
    },
    8: {
        5: 13.79,
        10: 14.15,
        25: 14.83,
        50: 15.78,
        75: 17.05,
        85: 17.95,
        90: 18.69,
        95: 20.06,
    },
    9: {
        5: 13.96,
        10: 14.35,
        25: 15.1,
        50: 16.16,
        75: 17.6,
        85: 18.63,
        90: 19.48,
        95: 21.08,
    },
    10: {
        5: 14.21,
        10: 14.64,
        25: 15.47,
        50: 16.64,
        75: 18.25,
        85: 19.4,
        90: 20.34,
        95: 22.15,
    },
    11: {
        5: 14.56,
        10: 15.02,
        25: 15.92,
        50: 17.2,
        75: 18.94,
        85: 20.19,
        90: 21.23,
        95: 23.21,
    },
    12: {
        5: 14.97,
        10: 15.47,
        25: 16.44,
        50: 17.81,
        75: 19.68,
        85: 21.02,
        90: 22.13,
        95: 24.22,
    },
    13: {
        5: 15.45,
        10: 15.98,
        25: 17.01,
        50: 18.47,
        75: 20.44,
        85: 21.85,
        90: 23,
        95: 25.17,
    },
    14: {
        // REVISED, ALRIGHT
        5: 15.99,
        10: 16.54,
        25: 17.63,
        50: 19.15,
        75: 21.21,
        85: 22.66,
        90: 23.84,
        95: 26.04,
    },
    15: {
        5: 16.55,
        10: 17.13,
        25: 18.27,
        50: 19.85,
        75: 21.97,
        85: 23.45,
        90: 24.64,
        95: 26.83,
    },
    16: {
        5: 17.13,
        10: 17.73,
        25: 18.91,
        50: 20.55,
        75: 22.72,
        85: 24.21,
        90: 25.4,
        95: 27.56,
    },
    17: {
        5: 17.7,
        10: 18.33,
        25: 19.55,
        50: 21.24,
        75: 23.44,
        85: 24.94,
        90: 26.13,
        95: 28.25,
    },
    18: {
        5: 18.2,
        10: 19.83,
        25: 20.1,
        50: 21.85,
        75: 24.1,
        85: 25.6,
        90: 26.8,
        95: 28.925,
    },
    19: {
        5: 18.73,
        10: 19.4,
        25: 20.69, // nice
        50: 22.44,
        75: 24.8,
        85: 26.36,
        90: 27.58,
        95: 29.62,
    },
    20: {
        5: 19.05,
        10: 19.8,
        25: 21.18,
        50: 23,
        75: 25.4025, // precise asf
        85: 27,
        90: 28.24,
        95: 30.59,
    },
};

/**
 * THESE ARE **ALREADY VALID**, however they use CDC's data from the year 2000. In the process of updating to data from 2022.
 *
 * @type {BMIPercentiles}
 */
export const FEMALE_PERCENTILES: BMIPercentiles = {
    2: {
        5: 14.7373,
        10: 15.0903,
        25: 15.7416,
        50: 16.575,
        75: 17.5572,
        85: 18.1622,
        90: 18.6095,
        95: 19.338,
    },
    // checkpoint. stuff below is using 2000 data.
    3: {
        5: 14.0,
        10: 14.32,
        25: 14.92,
        50: 15.69,
        75: 16.6,
        85: 17.16,
        90: 17.58,
        95: 18.25,
    },
    4: {
        5: 13.71,
        10: 14.9,
        25: 14.56,
        50: 15.29,
        75: 16.2,
        85: 16.8,
        90: 17.25,
        95: 18.02,
    },
    5: {
        5: 13.52,
        10: 13.81,
        25: 14.38,
        50: 15.15,
        75: 16.13,
        85: 16.8,
        90: 17.32,
        95: 18.25,
    },
    6: {
        5: 13.42,
        10: 13.74,
        25: 14.36,
        50: 15.21,
        75: 16.33,
        85: 17.09,
        90: 17.71,
        95: 18.83,
    },
    7: {
        5: 13.43,
        10: 13.79,
        25: 14.48,
        50: 15.45,
        75: 16.73,
        85: 17.62,
        90: 18.34,
        95: 19.67,
    },
    8: {
        5: 13.54,
        10: 13.94,
        25: 14.73,
        50: 15.82,
        75: 17.29,
        85: 18.31,
        90: 19.15,
        95: 20.69,
    },
    9: {
        5: 13.74,
        10: 14.19,
        25: 15.07,
        50: 16.3,
        75: 17.95,
        85: 19.11,
        90: 20.06,
        95: 21.81,
    },
    10: {
        5: 14.03,
        10: 14.53,
        25: 15.5,
        50: 16.86,
        75: 18.69,
        85: 19.98,
        90: 21.03,
        95: 22.98,
    },
    11: {
        5: 14.4,
        10: 14.93,
        25: 15.98,
        50: 17.46,
        75: 19.46,
        85: 20.86,
        90: 22.01,
        95: 24.14,
    },
    12: {
        5: 14.83,
        10: 15.4,
        25: 16.52,
        50: 18.1,
        75: 20.23,
        85: 21.74,
        90: 22.97,
        95: 25.25,
    },
    13: {
        5: 15.3,
        10: 15.9,
        25: 17.07,
        50: 18.73,
        75: 20.98,
        85: 22.57,
        90: 23.87,
        95: 26.29,
    },
    14: {
        5: 15.8,
        10: 16.42,
        25: 17.63,
        50: 19.35,
        75: 21.68,
        85: 23.34,
        90: 24.71,
        95: 27.25,
    },
    15: {
        5: 16.3,
        10: 16.93,
        25: 18.17,
        50: 19.93,
        75: 22.33,
        85: 24.04,
        90: 25.46,
        95: 28.12,
    },
    16: {
        5: 16.78,
        10: 17.42,
        25: 18.67,
        50: 20.45,
        75: 22.9,
        85: 24.66,
        90: 26.13,
        95: 28.9,
    },
    17: {
        5: 17.21,
        10: 17.84,
        25: 19.1,
        50: 20.9,
        75: 23.39,
        85: 25.2,
        90: 26.72,
        95: 29.63,
    },
    18: {
        5: 17.55,
        10: 18.18,
        25: 19.45,
        50: 21.27,
        75: 23.81,
        85: 25.67,
        90: 27.25,
        95: 30.32,
    },
    19: {
        5: 17.76,
        10: 18.41,
        25: 19.695,
        50: 21.55,
        75: 24.16,
        85: 26.09,
        90: 27.75,
        95: 31.02,
    },
    20: {
        5: 17.82,
        10: 18.48,
        25: 19.8,
        50: 21.71,
        75: 24.44,
        85: 26.47,
        90: 28.23,
        95: 31.76,
    },
};
