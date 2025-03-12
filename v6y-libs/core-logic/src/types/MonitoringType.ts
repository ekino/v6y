import { ApplicationType } from './ApplicationType.ts';

export interface GetEventsOptions {
    application: ApplicationType;
    dateStartStr: string;
    dateEndStr: string;
}

export interface DataDogEventsType {
    id: string;
    type: string;
    attributes: {
        attributes: {
            status: string;
            timestamp: number; // in ms
        };
    };
}

export interface MonitoringEventType {
    id: string;
    type: string;
    status: string;
    timestamp: number;
}
