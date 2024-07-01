// NOT DONE YET!!!!
// zaka no seas vago y trabaja

/*
CALCULATE RUNNING / WALKING PERFORMANCE
*/

// LAST UPDATE TO THIS FUNCTION, ITS DATA, ITS CALCULATIONS, OR ANYTHING THAT DOES AFFECT THE RESULT
// Changes that do not affect the result, like just bug-fixes, performance improvments, code-legibility improvments, or that kind of stuff, do not need to bump the date.
const UPDATED: string = "01/07/2024";
// ANY SOURCE THAT HAS BEEN USED TO DEVELOP THE CALCULATIONS / DATA PROVIDED or that BACKS IT UP.
const SOURCE: string = "";
// Ignore the old code lol - this wasn't the right source: https://strengthlevel.com/strength-standards/


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

interface LIFTING_Response {
    result: number;
    subject?: {
        age: number;
        gender: "male" | "female";
        weight: number;
        height: number;
        time: number;
        barweight: number;
        liftweight: number;
        repetitions: number;
        // TODO FROM HERE
    };
    context?: string;
    explanation?: string;
}

/**
 * Calculate the calories burnt during running or walking based on given parameters.
 * @param age The age of the subject.
 * @param gender The gender of the subject (either "male" or "female").
 * @param weight The weight of the subject in kilograms (KG).
 * @param height The height of the subject in centimeters (CM).
 * @param speed The speed in KM/h the subject was running to.
 * @param time The duration in HOURS of the exercise performed by the subject.
 * @param provideContext Whether to provide a brief contextualization about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns The calories burnt if neither provideContext nor provideExplanation are true, otherwise returns a LIFTING_Response object.
*/

export default function calculateRunningOrWalkingPerformance(
    age: number,
    gender: "male" | "female",
    weight: number,
    height: number,
    speed: number,
    time: number,
    provideContext?: boolean,
    provideExplanation?: boolean
): LIFTING_Response {
    let mets: number | null; // MET - Metabolic Equivalent of Task

    // Assign METs based on speed in km/h
    if (speed > 1.6092 && speed < 3.2181) {
        mets = 2;
    } else if (speed >= 3.2181 && speed <= 4.023) {
        mets = 2.5;
    } else if (speed > 4.023 && speed <= 4.8276) {
        mets = 3.5;
    } else if (speed > 4.8276 && speed <= 5.51) {
        mets = 4;
    } else if (speed > 5.51 && speed <= 6.44) {
        mets = 5;
    } else if (speed > 6.44 && speed <= 8.05) {
        mets = 6;
    } else if (speed > 8.05 && speed <= 9.65) {
        mets = 8;
    } else if (speed > 9.65 && speed <= 11.27) {
        mets = 10;
    } else if (speed > 11.27 && speed <= 12.87) {
        mets = 11;
    } else if (speed > 12.87 && speed <= 14.48) {
        mets = 11.5;
    } else if (speed > 14.48 && speed <= 16.09) {
        mets = 12.5;
    } else if (speed > 16.09) {
        mets = 16;
    } else {
        mets = null;
    }

    // Constant factor for calories burnt calculation
    const caloriesBurntPerKgPerHour = 0.075 * 4.3;

    // Calculate calories burnt
    let caloriesBurnt: number

    if (mets) {
        caloriesBurnt = mets * caloriesBurntPerKgPerHour * weight * time;
    } else {
        caloriesBurnt = 0 // if mets is not calculable, it returns 0.
    }

    const response: LIFTING_Response = {
        result: caloriesBurnt,
    };

    if (provideContext) {
        response.subject = {
            age,
            gender,
            weight,
            height,
            time,
        };
        response.context = "The context provides additional details about the subject's profile and exercise parameters.";
    }

    if (provideExplanation) {
        response.explanation = "The performance can be measured in burnt calories, which are obtained by calculating the time spent on the exercise, the subject's weight, and the Metabolic Equivalent of Task (MET).";
    }

    return response;
}
