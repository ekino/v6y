import { ApplicationType } from '@v6y/core-logic';

export interface DoraMetricsAuditConfigType {
    applicationId?: number;
}

export interface DeploymentDataType {
    sha: string;
    status: string;
    deployable: {
        created_at: string;
        finished_at: string;
    };
}

export interface CommitsDataType {
    id: string;
    created_at: string;
}

export interface MergeRequestDataType {
    created_at: string;
    merged_at: string;
}

export interface DeploymentFrequencyParamsType {
    deployments: DeploymentDataType[];
    dateStart: string;
    dateEnd: string;
}

export interface LeadReviewTimeParamsType {
    mergeRequests: MergeRequestDataType[];
    dateStart: string;
    dateEnd: string;
}

export interface LeadTimeForChangesParamsType {
    leadReviewTime: number;
    deployments: DeploymentDataType[];
    dateStart: string;
    dateEnd: string;
}

export interface DoraMetricType {
    value: number;
    status: string;
}

export interface DoraMetricsAuditParamsType {
    deployments: DeploymentDataType[];
    mergeRequests: MergeRequestDataType[];
    application: ApplicationType;
    dateStart: string;
    dateEnd: string;
}
