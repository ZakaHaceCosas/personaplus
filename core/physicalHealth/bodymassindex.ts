/*
CALCULATE BODY MASS INDEX
*/

// LAST UPDATE TO THIS FUNCTION, ITS DATA, ITS CALCULATIONS, OR ANYTHING THAT DOES AFFECT THE RESULT
// Changes that do not affect the result, like just bug-fixes, performance improvments, code-legibility improvments, or that kind of stuff, do not need to bump the date.
const UPDATED: string = "10/08/2024";
// ANY SOURCE THAT HAS BEEN USED TO DEVELOP THE CALCULATIONS / DATA PROVIDED or that BACKS IT UP.
const SOURCE: string = "https://www.cdc.gov/growthcharts/data/set1clinical/cj41c024.pdf and https://www.cdc.gov/growthcharts/data/set1clinical/cj41c023.pdf";
// i initially created this with https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html#Interpreted, but the link doesnt work now :v

/**
 * Get all the sources of information used to develop the function, it's data, contents, returns, and etc...
 * @returns A single string with all the URLs, separated by "and" in case there's more than one - e.g. "https://coolsite.com and https://example.source"
*/

export function getSource() {
    return SOURCE;
}

/**
 * Get the date of the last update made to this function (considering "update" any change to it's sources, calculations, data, results, etc... but not trivial, performance, code cleaning or similar changes.)
 * @returns A string with the date of the last update, using the DD/MM/YYYY format.
*/

export function getLastUpdate() {
    return UPDATED;
}

interface BMIResponse {
    result: number;
    subject?: {
        age: number;
        gender: "male" | "female";
        weight: number;
        height: number;
    };
    context?: string;
    explanation?: string;
}

/**
 * Represents percentiles data for Body Mass Index (BMI) for individuals between 2 and 20 years of age.
 *
 * @interface BMIPercentiles
 * @typedef {BMIPercentiles}
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

// you can skip / collapse this part
// while for people over 20 years of age BMI calculations can be generic
// for people under 20 we need to use the percentiles
// which translates to turn two graphics with 8 entires per age and 18 ages each
// into separate objects

// note:
// since i only have a visual graph and not a table, there is a very slight possible error margin (i have vision problems alright?). the error margin is of a max of 0.2
// as seen in documentation (testing section) the default valid error margin for health calculations (like this one) is of 0.3, hence there shouldnt be any big problem, dont worry if you see ive put "15.76" and for you that point of the graph looks like "15.69", for example

// (send help)
const male_percentiles: BMIPercentiles = {
    2: {
        5: 14,
        10: 15.1,
        25: 15.76,
        50: 16.60,
        75: 17.58,
        85: 18.20,
        90: 18.60,
        95: 19.35
    },
    // TODO
}

const female_percentiles: BMIPercentiles = {
    // TODO
}

/**
 * Calculate Body Mass Index (BMI) based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @param provideContext Whether to provide a brief contextualisation about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns The BMI value if neither provideContext nor provideExplanation are true, otherwise returns an object with "result" as the BMI value.
*/

export default function calculateBodyMassIndex(age: number, gender: "male" | "female", weight: number, height: number, provideContext?: boolean, provideExplanation?: boolean): BMIResponse {
    // You MUST pass weight as KG (kilograms) and height as CM (centimeters)
    const bmi = weight / ((height / 100) ** 2);

    let context: string | undefined;

    function getPercentile(bmi: number, age: number): number {
        const percentilesForAge = gender === "male"
            ? male_percentiles[age]
            : female_percentiles[age];

        if (!percentilesForAge) {
            throw new Error(`Percentiles data for age ${age} not available.`);
        }

        // sort the percentiles i guess
        const sortedPercentiles = Object.keys(percentilesForAge).map(Number).sort((a, b) => a - b);

        // spot the percentile that corresponds to the BMI/AGE data and return it
        for (const percentile of sortedPercentiles) {
            if (bmi <= percentilesForAge[percentile as 5 | 10 | 25 | 50 | 75 | 85 | 95]) {
                return percentile;
            }
        }

        return 100; // max percentile is 95. a return of 100 means that bro got a serious problem :skull:
    }

    if (age < 0) {
        context = "Invalid age provided.";
    } else if (age < 20) {
        const percentile = getPercentile(bmi, age);

        if (percentile < 5) {
            context = "underweight";
        } else if (percentile >= 5 && percentile < 85) {
            context = "healthy weight";
        } else if (percentile >= 85 && percentile < 95) {
            context = "overweight";
        } else {
            context = "obesity";
        }
    } else {
        if (bmi < 18.5) {
            context = "underweight";
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            context = "healthy weight";
        } else if (bmi >= 25.0 && bmi <= 29.9) {
            context = "overweight";
        } else {
            context = "obesity";
        }
    }

    const response: BMIResponse = {
        result: bmi,
    };

    if (provideContext) {
        response.subject = {
            age,
            gender,
            weight,
            height,
        };
        response.context = context;
    }

    if (provideExplanation) {
        response.explanation = "(According to CDC) Body mass index (BMI) is a person's weight in kilograms divided by the square of height in meters. BMI is an inexpensive and easy screening method for weight category—underweight, healthy weight, overweight, and obesity. BMI does not measure body fat directly, but BMI is moderately correlated with more direct measures of body fat. Furthermore, BMI appears to be as strongly correlated with various metabolic and disease outcomes as are these more direct measures of body fatness.";
    }

    return response;
}
