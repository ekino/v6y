export const AUDIT_RUN_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    FAILED: 'failed',
    ERROR: 'error',
} as const;

export type AuditRunStatus = (typeof AUDIT_RUN_STATUS)[keyof typeof AUDIT_RUN_STATUS];

export const AUDIT_RUN_NON_TERMINAL_STATUSES: AuditRunStatus[] = [
    AUDIT_RUN_STATUS.PENDING,
    AUDIT_RUN_STATUS.IN_PROGRESS,
];

export interface AuditRunType {
    _id?: number;
    appId: number;
    branch?: string;
    runStatus?: AuditRunStatus | string;
    analysisTypes?: string[];
    triggeredAt?: Date;
    completedAt?: Date | null;
    errorMessage?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
