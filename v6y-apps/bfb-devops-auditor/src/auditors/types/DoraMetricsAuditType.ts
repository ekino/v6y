import { ApplicationType } from '@v6y/core-logic';

export interface DoraMetricsAuditConfigType {
    applicationId?: number;
}

export interface DeploymentDataType {
    created_at: string;
    sha: string;
    status: string;
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

export interface DoraMetricsAuditParamsType {
    deployments?: DeploymentDataType[];
    commits?: CommitsDataType[];
    application: ApplicationType;
}
