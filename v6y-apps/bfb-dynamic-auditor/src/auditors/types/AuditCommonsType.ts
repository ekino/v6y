import { ApplicationType } from '@v6y/core-logic';

export interface AuditCommonsType {
    applicationId?: number;
    application?: ApplicationType;
    workspaceFolder?: string;
    auditRunId?: string;
}

/**
 * Outcome of an auditor run.
 *
 * `skipped` keeps "there was nothing for this auditor to do" distinguishable from
 * both a clean success and a real failure, so the caller never has to infer one
 * from the other.
 */
export type AuditOutcomeStatus = 'success' | 'skipped' | 'failed';

export interface AuditOutcome {
    status: AuditOutcomeStatus;
    message?: string;
}
