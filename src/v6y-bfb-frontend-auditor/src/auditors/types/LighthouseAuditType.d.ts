import { ApplicationType } from '@v6y/commons';
export type LighthouseDeviceConfigType = {
    extends: string;
    settings: {
        formFactor: 'mobile' | 'desktop' | undefined;
        throttling: {
            rttMs: number;
            throughputKbps: number;
            cpuSlowdownMultiplier: number;
            requestLatencyMs: number;
            downloadThroughputKbps: number;
            uploadThroughputKbps: number;
        };
        screenEmulation: {
            width: number;
            height: number;
            deviceScaleFactor: number;
            mobile: boolean;
            disabled: boolean;
        };
        emulatedUserAgent: string;
    };
};
export interface LighthouseAuditConfigType {
    applicationId?: number;
    link?: string;
    browserPath?: string;
    lightHouseConfig?: LighthouseDeviceConfigType;
}
export interface LighthouseAuditCategoryType {
    id?: string;
    score?: number;
    title?: string;
    description?: string;
}
export interface LighthouseAuditMetricType {
    id?: string;
    title?: string;
    description?: string;
    numericValue: number;
    numericUnit: string;
}
export interface LighthouseReportType {
    appLink?: string;
    subCategory?: string;
    data?: string | string[] | undefined;
    category?: string;
    title?: string;
    description?: string;
    status?: string;
    score?: number;
    scoreUnit?: string;
    branch?: string;
}
export interface LighthouseAuditParamsType {
    application?: ApplicationType;
    reports?: LighthouseReportType[];
}
