export interface FullProfile {
    username: string;
    age: number | "";
    height: number | "";
    weight: number | "";
    gender: "male" | "female" | null;
    language: "es" | "en";
    activness: "poor" | "small" | "normal" | "intense" | "super" | null;
    focus: "noPriority" | "assistMePls" | "wellbeing" | "diet" | "exercising" | "" | null; // both "" and null serve as a "null" / invalid value
    sleepHours: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "";
    theThinkHour: string,
    isNewUser: boolean,
}

export type BasicUserData = Omit<FullProfile, "focus" | "sleepHours" | "activness" | "language">;
export type BasicUserHealthData = Omit<BasicUserData, "username">;
