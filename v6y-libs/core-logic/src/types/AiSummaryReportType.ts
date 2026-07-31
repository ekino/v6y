export interface AiSummaryReportType {
    _id?: number;
    appId: number;
    summary: string;
    score?: number | null;
    model?: string | null;
    tokensUsed?: number | null;
    generatedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
