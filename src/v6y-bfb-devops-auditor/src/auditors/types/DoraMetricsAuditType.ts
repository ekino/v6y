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

export interface DoraMetricReportType {
    value: number;
    status: 'success' | 'failure';
}
export interface DoraMetricsFullReportType {
    deploymentFrequency: DoraMetricReportType;
    leadTimeForChanges: DoraMetricReportType;
    changeFailureRate: DoraMetricReportType;
    meanTimeToRestoreService: DoraMetricReportType;
}

export interface DoraMetricsAuditParamsType {
    report: DoraMetricsFullReportType;
    application: ApplicationType;
}
