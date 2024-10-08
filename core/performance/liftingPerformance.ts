// TODO: NOT DONE YET!!!!
// zaka no seas vago y trabaja

/*
CALCULATE RUNNING / WALKING PERFORMANCE
*/

import { default as OneRepetitionMax } from "@/core/physicalHealth/OneRepMax"
import CreateComponentDataUtilities from "@/core/tools/OpenHealthDataBuilder";

export const { getSource, getLastUpdate } = CreateComponentDataUtilities(
    "01/07/2024",
    "" // FIXME: NEED TO PROVIDE SOURCE
)

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
        scales: number,
        repetitions: number;
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
 * @param provideContext Whether to provide a brief contextualization about the result.
 * @param provideExplanation Whether to provide a detailed explanation about what the calculation means.
 * @returns The calories burnt if neither provideContext nor provideExplanation are true, otherwise returns a LIFTING_Response object.
*/

export default function calculateLiftingPerformance(
    age: number,
    gender: "male" | "female",
    weight: number,
    height: number,
    time: number,
    barweight: number,
    liftweight: number,
    scales: number,
    repetitions: number,
    provideContext?: boolean,
    provideExplanation?: boolean
): LIFTING_Response {
    // Get the Metabolic Equivalent of Task for this
    const calculateMET = (w: number, onerm: number, a: number, g: "male" | "female", r: number, t: number): number => {
        const GENDER_COEFFICIENT = g === "male" ? 1 : 0.85;
        const AGE_ADJUSTMENT = 1 / (1 + 0.01 * (a - 22));
        const BASE_MET = 5.0;

        return (BASE_MET * (w / onerm) * r * AGE_ADJUSTMENT * GENDER_COEFFICIENT) * t / 60;
    };

    const weightLifted = (barweight + (2 * liftweight)) * scales;
    const OneRepMaxObject = OneRepetitionMax(weightLifted, repetitions, true, false, false);

    const oneRepMax = OneRepMaxObject.result;

    const metabolicEquivOfTask = calculateMET(weightLifted, oneRepMax, age, gender, repetitions, time);

    const caloriesBurntPerKgPerHour = 0.075 * 4.3;

    const caloriesBurnt = metabolicEquivOfTask * caloriesBurntPerKgPerHour * weight * time;

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
            barweight,
            liftweight,
            scales,
            repetitions
        };
        response.context = "The performance of a weight lifting session is measured in burnt calories, being an estimated " + caloriesBurnt + "cal for this session.";
    }

    if (provideExplanation) {
        response.explanation = "The 'performance' of a weight lifting session can be measured in burnt calories, which are obtained with a series of generic calculations using age, weight, height, gender of the subject, and other parameters weight lifted, time duration of the session, and the One Repetition Max.";
    }

    return response;
}
