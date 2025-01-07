import { ApplicationType } from '@v6y/commons';

export interface DoraMetricsAuditConfigType {
    applicationId?: number;
}

export interface DeploymentDataType {
    created_at: string;
    sha: string;
}

export interface CommitsDataType {
    id: string;
    created_at: string;
}

export interface DoraMetricsData {
    deployments?: DeploymentDataType[];

    commits?: CommitsDataType[];
}

export interface DoraMetricType {
    value: number;
    status: 'success' | 'failure';
}
export interface DoraMetricsReportType {
    deploymentFrequency: DoraMetricType;
    leadTimeForChanges: DoraMetricType;
    changeFailureRate: DoraMetricType;
    meanTimeToRestoreService: DoraMetricType;
}

export interface DoraMetricsAuditParamsType {
    report: DoraMetricsReportType;
    application: ApplicationType;
}