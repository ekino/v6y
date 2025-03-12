import AppLogger from '../core/AppLogger.ts';
import { DataDogEventsType, MonitoringEventType } from '../types/MonitoringType.ts';

/**
 * Converts DataDog events to ServerStatusEventType.
 * @param dataDogEvents
 * @param dateStartTimeStamp
 * @param dateEndTimeStamp
 **/
const convertDataDogEventsToMonitoringEvents = ({
    dataDogEvents,
    dateStartTimeStamp,
    dateEndTimeStamp,
}: {
    dataDogEvents: DataDogEventsType[];
    dateStartTimeStamp: number;
    dateEndTimeStamp: number;
}): MonitoringEventType[] => {
    try {
        return dataDogEvents
            .filter(
                ({
                    type,
                    attributes: {
                        attributes: { status, timestamp },
                    },
                }: {
                    type: string;
                    attributes: {
                        attributes: { status: string; timestamp: number };
                    };
                }) =>
                    type === 'event' &&
                    ['error', 'success'].includes(status) &&
                    timestamp >= dateStartTimeStamp &&
                    timestamp <= dateEndTimeStamp,
            )
            .map(
                ({
                    id,
                    type,
                    attributes: {
                        attributes: { status, timestamp },
                    },
                }: {
                    id: string;
                    type: string;
                    attributes: {
                        attributes: { status: string; timestamp: number };
                    };
                }) => ({
                    id: id,
                    type: type,
                    status: status,
                    timestamp: timestamp,
                }),
            )
            .sort(
                (a: { timestamp: number }, b: { timestamp: number }) => a.timestamp - b.timestamp,
            );
    } catch (error) {
        AppLogger.error(
            `[EventApi - convertDataDogEventsToEvents] An exception occurred during the data formatting: ${error}`,
        );
    }
    return [];
};

const MonitoringUtils = {
    convertDataDogEventsToMonitoringEvents,
};

export default MonitoringUtils;
