export interface AuditRunType {
    _id?: number;
    appId: number;
    triggeredAt?: Date;
    completedAt?: Date;
    status?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    triggeredBy?: string;
}
