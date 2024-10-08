import { BasicUserHealthData } from "@/types/User";

interface SubjectDataPrev extends BasicUserHealthData {
    [key: string]: string | number | boolean | null | undefined;
}

type SubjectData = Omit<
    SubjectDataPrev,
    "sleepHours" | "theThinkHour" | "isNewUser"
>;

export interface CoreLibraryResponse {
    result: number;
    subject?: SubjectData;
    context?: string;
    explanation?: string;
}

export interface CoreLibraryResponsePredictable {
    result: number;
    subject: BasicUserHealthData;
    context?: string;
    explanation?: string;
}

export interface CoreLibraryResponseVersatile {
    result: number;
    subject?: {
        age?: number | null;
        weight?: number | null;
        height?: number | null;
        gender?: "male" | "female" | null;
        [key: string]: string | number | boolean | null | undefined;
    };
    context?: string;
    explanation?: string;
}
