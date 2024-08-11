import { UserHealthData } from "@/src/toolkit/userData";

interface SubjectData extends UserHealthData {
    [key: string]: string | number | boolean | null | undefined;
}

export default interface OpenHealthResponse {
    result: number,
    subject?: SubjectData
    context?: string
    explanation?: string
}
