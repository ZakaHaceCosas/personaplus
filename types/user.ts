import { CoreLibraryType_Activeness } from "@/core/types/misc_types";

type MedicalConditionId =
    | "broCantBreathe"
    | "broCantHeartbeat"
    | "broCantMove"
    | "broCantEat";

export interface FullProfileForCreation {
    username: string;
    age: number | "";
    height: number | "";
    weight: number | "";
    gender: "male" | "female" | null;
    language: "es" | "en";
    activeness: CoreLibraryType_Activeness | null;
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
    wantsNotifications: boolean;
    healthConditions: string[] | "none" | "" | null;
}

export interface FullProfile {
    username: string;
    age: number;
    height: number;
    weight: number;
    gender: "male" | "female";
    language: "es" | "en";
    activeness: CoreLibraryType_Activeness;
    focus: "noPriority" | "assistMePls" | "wellbeing" | "diet" | "exercising";
    sleepHours: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11; // 11 = more than ten
    theThinkHour: string;
    isNewUser: boolean;
    wantsNotifications: boolean;
    healthConditions: MedicalConditionId[] | "none";
}

/* type AllUnknown<T> = {
    [K in keyof T]: any;
}; */

export type BasicUserData = Omit<
    FullProfile,
    | "focus"
    | "language"
    | "isNewUser"
    | "wantsNotifications"
    | "theThinkHour"
    | "healthConditions"
>;
export type BasicUserHealthData = Omit<
    BasicUserData,
    "activeness" | "sleepHours" | "username"
>;

/**
 * All experiments, and whether they're enabled (`true`) or disabled (`false`).
 *
 * @export
 * @interface Experiments
 */
export interface Experiments {
    exp_tracker: boolean;
}

export type Experiment = "exp_tracker";
