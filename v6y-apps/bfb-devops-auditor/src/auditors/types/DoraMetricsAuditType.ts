import { ApplicationType, DeployementType, MergeRequestType } from '@v6y/core-logic';

export interface DoraMetricsAuditConfigType {
    applicationId?: number;
}

export interface DeploymentFrequencyParamsType {
    deployments: DeployementType[];
    dateStart: string;
    dateEnd: string;
}

export interface LeadReviewTimeParamsType {
    mergeRequests: MergeRequestType[];
    dateStart: string;
    dateEnd: string;
}

export interface LeadTimeForChangesParamsType {
    leadReviewTime: number;
    deployments: DeployementType[];
    dateStart: string;
    dateEnd: string;
}

export interface DoraMetricType {
    value: number;
    status: string;
}

export interface DoraMetricsAuditParamsType {
    deployments: DeployementType[];
    mergeRequests: MergeRequestType[];
    application: ApplicationType;
    dateStart: string;
    dateEnd: string;
}
