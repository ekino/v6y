import { ApplicationType, DeployementType, MergeRequestType } from '@v6y/core-logic';
import { MonitoringEventType, RepositoryType } from '@v6y/core-logic';

export interface DoraMetricsAuditConfigType {
    applicationId?: number;
}

export interface startDoraMetricsAnalysisParamsType {
    application: ApplicationType;
    repositoryDetails: RepositoryType;
    dateStart: Date;
    dateEnd: Date;
}

export interface DeploymentFrequencyParamsType {
    deployments: DeployementType[];
    dateStart: Date;
    dateEnd: Date;
}

export interface LeadReviewTimeParamsType {
    mergeRequests: MergeRequestType[];
    dateStart: Date;
    dateEnd: Date;
}

export interface LeadTimeForChangesParamsType {
    leadReviewTime: number;
    deployments: DeployementType[];
    dateStart: Date;
    dateEnd: Date;
}

export interface ServerDowntimePeriodType {
    start_time: number;
    end_time: number | null;
    duration_miliseconds: number;
    start_id: string;
    end_id: string;
}

export interface calculateDownTimePeriodsParams {
    monitoringEvents: MonitoringEventType[];
    dateStart: Date;
    dateEnd: Date;
}

export interface CalculateMeanTimeToRestoreServiceParams {
    downtimePeriods: ServerDowntimePeriodType[];
}

export interface CalculateUpTimeAverageParams {
    downtimePeriods: ServerDowntimePeriodType[];
    dateStart: Date;
    dateEnd: Date;
}
export interface DoraMetricType {
    value: number;
    status: string;
}

export interface DoraMetricsAuditParamsType {
    deployments: DeployementType[];
    mergeRequests: MergeRequestType[];
    monitoringEvents: MonitoringEventType[];
    application: ApplicationType;
    dateStart: Date;
    dateEnd: Date;
}
