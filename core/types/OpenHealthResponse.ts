import { UserHealthData } from "@/src/toolkit/userData";

interface SubjectData extends UserHealthData {
    [key: string]: string | number | boolean | null | undefined;
}

export interface OpenHealthResponse {
    result: number,
    subject?: SubjectData,
    context?: string,
    explanation?: string
}

export interface OpenHealthResponsePredictable {
    result: number,
    subject: UserHealthData,
    context?: string,
    explanation?: string
}

export interface OpenHealthResponseVersatile {
    result: number,
    subject?: {
        age?: number | null,
        weight?: number | null,
        height?: number | null,
        gender?: "male" | "female" | null,
        [key: string]: string | number | boolean | null | undefined
    },
    context?: string,
    explanation?: string
}
