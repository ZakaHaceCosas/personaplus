/*
CALCULATE ONE REPETITION MAX
*/

// LAST UPDATE TO THIS FUNCTION, ITS DATA, ITS CALCULATIONS, OR ANYTHING THAT DOES AFFECT THE RESULT
// Changes that do not affect the result, like just bug-fixes, performance improvments, code-legibility improvments, or that kind of stuff, do not need to bump the date.
const UPDATED: string = "08/07/2024";
// ANY SOURCE THAT HAS BEEN USED TO DEVELOP THE CALCULATIONS / DATA PROVIDED or that BACKS IT UP.
const SOURCE: string = "https://en.wikipedia.org/wiki/One-repetition_maximum";
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

interface ONERM_Response {
    result: number;
    percentage?: number;
    subject?: {
        weightLiftedPerRep: number;
        amountOfReps: number;
    }
    context?: string;
    explanation?: string;
}

/**
 * Calculate the One-Repetition Maximum (1RM) for weight lifting sessions.
 * @param {number} weightLiftedPerRep The total weight lifted per repetition (in kilograms or pounds).
 * @param {number} amountOfReps The number of repetitions performed.
 * @param {boolean} providePercentage Whether to provide the One-Repetition Maximum percentage, an extra calculation helpful to determine the Metabolic Equivalent of Task for weightlifting.
 * @param {boolean} provideContext Whether to provide a brief contextualization about the result.
 * @param {boolean} provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns {number | ONERM_Response} The 1RM (One-Rep Max) if neither provideContext, provideExplanation, nor providePercentage are true; otherwise, returns an ONERM_Response object.
 */

export default function calculateOneRepetitionMax(
    weightLiftedPerRep: number, amountOfReps: number, providePercentage?: boolean, provideContext?: boolean,
    provideExplanation?: boolean): ONERM_Response {
    const firstoperation_firststep: number = amountOfReps / 30
    const firstoperation_secondstep: number = 1 + firstoperation_firststep
    const firstoperation_thirdstep: number = weightLiftedPerRep * firstoperation_secondstep

    const result: number = firstoperation_thirdstep
    // ESLint disabled because: It asks for response to be "const" as it never gets reassigned, but it does get reassigned.
    // eslint-disable-next-line
    let response: ONERM_Response = {
        result: result
    }

    if (provideContext) {
        response.subject = {
            weightLiftedPerRep: weightLiftedPerRep,
            amountOfReps: amountOfReps
        }
        response.context = "The OneRepMax is the max amount of weight that a person can lift, being of " + result + " for this context."
    }

    if (provideExplanation) {
        response.explanation = "The One Repetition Maximum is the maximum amount of weight a person can lift. It can also be considered the max amount of force a person can apply in one maximal contraction. While the most precise method of measuring would be just trial and error testing with the person, it can be estimated mathematically using one of the many possible formulas, e.g., Epley's formula."
    }

    if (providePercentage) {
        const secondoperation_firststep: number = firstoperation_secondstep
        const secondoperation_secondstep: number = 1 / secondoperation_firststep
        const secondoperation_thirdstep: number = secondoperation_secondstep * 100
        response.percentage = secondoperation_thirdstep
    }

    return response
}
