export interface Log {
    message: string;
    type: "log" | "warn" | "error" | "success";
    timestamp: number;
}

export type Logs = Log[];
