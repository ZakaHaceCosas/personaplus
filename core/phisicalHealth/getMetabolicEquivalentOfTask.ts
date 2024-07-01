/*
CALCULATE THE METABOLIC EQUIVALENT OF A TASK
*/

// LAST UPDATE TO THIS FUNCTION, ITS DATA, ITS CALCULATIONS, OR ANYTHING THAT DOES AFFECT THE RESULT
// Changes that do not affect the result, like just bug-fixes, performance improvments, code-legibility improvments, or that kind of stuff, do not need to bump the date.
const UPDATED: string = "01/07/2024";
// ANY SOURCE THAT HAS BEEN USED TO DEVELOP THE CALCULATIONS / DATA PROVIDED or that BACKS IT UP.
const SOURCE: string = "https://en.wikipedia.org/wiki/Metabolic_equivalent_of_task > https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.107.185649 and https://www.inchcalculator.com/calories-burned-weight-lifting-calculator/";


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

interface MET_Response {
    result: number;
    subject?: {
        age: number;
        gender: "male" | "female";
        intensity: "superlow" | "very_low" | "low" | "low_to_mid" | "mid" | "mid_to_high" | "not_too_high" | "high" | "higher" | "very_high" | "very_high_to_intense" | "not_too_intense" | "a_bit_intense" | "intense" | "pretty_intense" | "very_intense" | "really_intense";
    };
    context?: string;
    explanation?: string;
}

/**
 * Returns the Metabolic Equivalent of a Task
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param intensity The intensity of the activity. It's a very long array of options, see the documentation for more info on which one to choose.
 * @param provideContext Whether to provide a brief contextualization about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns A number with the Metabolic Equivalent of the Task if neither provideContext nor provideExplanation are true, otherwise returns a MET_Response object.
*/

export default function calculateMetabolicEquivalentOfTask(
    age: number,
    gender: "male" | "female",
    intensity: "superlow" | "very_low" | "low" | "low_to_mid" | "mid" | "mid_to_high" | "not_too_high" | "high" | "higher" | "very_high" | "very_high_to_intense" | "not_too_intense" | "a_bit_intense" | "intense" | "pretty_intense" | "very_intense" | "really_intense",
    provideContext?: boolean,
    provideExplanation?: boolean
): MET_Response {
    let mets: number; // MET - Metabolic Equivalent of Task

    // Assign METs based on intensity level
    if (intensity === "superlow") {
        mets = 1.5;
    } else if (intensity === "very_low") {
        mets = 2.0;
    } else if (intensity === "low") {
        mets = 3.0;
    } else if (intensity === "low_to_mid") {
        mets = 3.5;
    } else if (intensity === "mid") {
        mets = 5.0;
    } else if (intensity === "mid_to_high") {
        mets = 5.0;
    } else if (intensity === "not_too_high") {
        mets = 5.8;
    } else if (intensity === "high") {
        mets = 6.0;
    } else if (intensity === "higher") {
        mets = 6.5; // Adjusted for >6.0
    } else if (intensity === "very_high") {
        mets = 7.4;
    } else if (intensity === "very_high_to_intense") {
        mets = 8.0;
    } else if (intensity === "not_too_intense") {
        mets = 8.8;
    } else if (intensity === "a_bit_intense") {
        mets = 9.8;
    } else if (intensity === "intense") {
        mets = 10.3;
    } else if (intensity === "pretty_intense") {
        mets = 10.5;
    } else if (intensity === "very_intense") {
        mets = 11.0;
    } else if (intensity === "really_intense") {
        mets = 11.2;
    } else {
        throw new Error("CALCULATION ERROR! Intensinty is not valid")
    }

    const response: MET_Response = {
        result: mets,
    };

    if (provideContext) {
        response.subject = {
            age,
            gender,
            intensity
        };
        response.context = "The context provides additional details about the subject's profile and exercise parameters.";
    }

    if (provideExplanation) {
        response.explanation = "The performance can be measured in burnt calories, which are obtained by calculating the time spent on the exercise, the subject's weight, and the Metabolic Equivalent of Task (MET).";
    }

    return response;
}
