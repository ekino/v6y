import { ApplicationType } from '@v6y/commons';

export interface DoraMetricsAuditConfigType {
    applicationId?: number;
}

export interface DoraMetricsData {
    deployments?: {
        created_at: string;
        sha: string;
    }[];

    commits?: {
        id: string;
        created_at: string;
    }[];
}

export interface DoraMetricsReportType {
    deploymentFrequency: number;
    leadTimeForChanges: number;
    changeFailureRate: number;
    meanTimeToRestoreService: number;
}

export interface DoraMetricsAuditParamsType {
    report: DoraMetricsReportType;
    application: ApplicationType;
}
