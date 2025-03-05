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

export interface DataDogEventsType {
    data: {
        id: string;
        type: string;
        attributes: {
            attributes: {
                status: string;
                timestamp: number; // in ms
            };
        };
    }[];
}

export interface ServerStatusEventType {
    id: string;
    type: string;
    status: string;
    timestamp: number;
}

export interface ServerDowntimePeriodType {
    start_time: number;
    end_time: number | null;
    duration_miliseconds: number;
    start_id: string;
    end_id: string;
}

export interface CalculateMeanTimeToRestoreServiceParams {
    downtimePeriods: ServerDowntimePeriodType[];
}

export interface calculateUpTimeAverageParams {
    downtimePeriods: ServerDowntimePeriodType[];
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
    dataDogEvents: DataDogEventsType;
    application: ApplicationType;
    dateStart: string;
    dateEnd: string;
}
