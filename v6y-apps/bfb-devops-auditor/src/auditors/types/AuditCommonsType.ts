import { ApplicationType } from '@v6y/core-logic';

export interface AuditCommonsType {
    applicationId?: number;
    application?: ApplicationType;
    auditRunId?: string;
}

/**
 * Outcome of an auditor run.
 *
 * `skipped` exists so that "there was nothing for this auditor to do" stays
 * distinguishable from both a clean success and a real failure. DORA metrics are
 * built on GitLab endpoints (projects/:id/deployments and /merge_requests) with no
 * GitHub equivalent, so a project without a resolvable GitLab id is legitimately
 * skipped and must not fail the whole audit run.
 */
export type AuditOutcomeStatus = 'success' | 'skipped' | 'failed';

export interface AuditOutcome {
    status: AuditOutcomeStatus;
    message?: string;
}
