export interface AuditRunType {
    _id?: number;
    appId: number;
    branch?: string;
    runStatus?: string;
    analysisTypes?: string[];
    triggeredAt?: Date;
    completedAt?: Date | null;
    errorMessage?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
