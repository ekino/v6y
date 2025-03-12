import { DataDogConfigType } from './ApplicationConfigType.ts';
import { ApplicationType } from './ApplicationType.ts';

export interface GetEventsOptions {
    application: ApplicationType;
    dateStart: Date;
    dateEnd: Date;
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

export interface fetchDataDogEventsParamsType {
    dataDogConfig: DataDogConfigType;
    dateStart: Date;
    dateEnd: Date;
}

export interface MonitoringEventType {
    id: string;
    type: string;
    status: string;
    timestamp: number;
}
