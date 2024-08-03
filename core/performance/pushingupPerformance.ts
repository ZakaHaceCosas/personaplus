/*
CALCULATE RUNNING / WALKING PERFORMANCE
*/

// LAST UPDATE TO THIS FUNCTION, ITS DATA, ITS CALCULATIONS, OR ANYTHING THAT DOES AFFECT THE RESULT
// Changes that do not affect the result, like just bug-fixes, performance improvments, code-legibility improvments, or that kind of stuff, do not need to bump the date.
const UPDATED: string = "03/08/2024";
// ANY SOURCE THAT HAS BEEN USED TO DEVELOP THE CALCULATIONS / DATA PROVIDED or that BACKS IT UP.
const SOURCE: string = "https://fitnessvolt.com/calories-burned-push-up-calculator/";

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

interface PUSHINGUP_Response {
    result: number;
    subject?: {
        age: number;
        gender: "male" | "female";
        weight: number;
        height: number;
        time: number;
        pushUps: number;
        hands: number;
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
 * @param time The duration in MINUTES of the exercise performed by the subject.
 * @param hands Whether push ups were done with both hands or only one.
 * @param pushUps The amount of push ups that were done.
 * @param provideContext Whether to provide a brief contextualization about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns The calories burnt if neither provideContext nor provideExplanation are true, otherwise returns a PUSHINGUP_Response object.
*/

export default function calculateLiftingPerformance(
    age: number,
    gender: "male" | "female",
    weight: number,
    height: number,
    time: number,
    pushUps: number,
    hands: number,
    provideContext?: boolean,
    provideExplanation?: boolean
): PUSHINGUP_Response {
    const calcMet = (): number => {
        // General MET values, according to source
        const moderateMET = 3.8;
        const vigorousMET = 8.0;

        // Thresholds for moderate and vigorous effort push-up rates
        // Source? Good question :skull:
        // let's rely on open-source repo getting popular and all of this being reviewed
        // don't kill me if i mistake, im not medic, i just trust online sources
        const moderateThreshold = gender === 'male' ? 10 : 8;
        const vigorousThreshold = gender === 'male' ? 20 : 15;

        // Push-up rate
        const rate = pushUps / time

        // Estimate effort based on push-up rate and adjust based on age
        if (rate >= vigorousThreshold) {
            return vigorousMET;
        } else if (rate >= moderateThreshold) {
            return moderateMET;
        } else {
            // Less than moderate effort, assuming moderate MET for calculation
            return moderateMET;
        }
    }

    const calculatePerformance = (): number => {
        const met = calcMet()

        const calculateCaloriesBurntPerMinute = () => {
            // (3.5 * MET * WEIGHT[kg]) / 200
            const firststep = 3.5 * met
            const secondstep = firststep * weight
            const thirdstep = secondstep / 200 // CALORIES FOR ONE MINUTE
            return thirdstep
        }
        const caloriesBurnt: number = calculateCaloriesBurntPerMinute() * time
        return caloriesBurnt
    }

    const caloriesBurnt = calculatePerformance()

    const response: PUSHINGUP_Response = {
        result: caloriesBurnt,
    };

    if (provideContext) {
        response.subject = {
            age,
            gender,
            weight,
            height,
            time,
            pushUps,
            hands
        };
        response.context = "The performance of a pushing up session is measured in burnt calories, being an estimated " + caloriesBurnt + "cal for this session.";
    }

    if (provideExplanation) {
        response.explanation = "The 'performance' of a pushing up session can be measured in burnt calories, which are obtained with a series of generic calculations using weight of the subject and other parameters like the push ups or the duration of the session.";
    }

    return response;
}
