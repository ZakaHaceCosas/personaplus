export interface FullProfile {
    username: string;
    age: number | "";
    height: number | "";
    weight: number | "";
    gender: "male" | "female" | null;
    language: "es" | "en";
    activeness: "poor" | "light" | "normal" | "intense" | "super" | null;
    focus:
        | "noPriority"
        | "assistMePls"
        | "wellbeing"
        | "diet"
        | "exercising"
        | null;
    sleepHours: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | null; // 11 = more than ten
    theThinkHour: string;
    isNewUser: boolean;
}

export type BasicUserData = Omit<
    FullProfile,
    "focus" | "sleepHours" | "activeness" | "language" | "isNewUser"
>;
export type BasicUserHealthData = Omit<
    BasicUserData,
    "username" | "theThinkHour"
>;
