import AppLogger from '../core/AppLogger.ts';
import { DataDogEventsType, MonitoringEventType } from '../types/MonitoringType.ts';
import DateUtils from './DateUtils.ts';

/**
 * Converts DataDog events to ServerStatusEventType.
 * @param dataDogEvents
 * @param dateStart
 * @param dateEnd
 **/
const convertDataDogEventsToMonitoringEvents = ({
    dataDogEvents,
    dateStart,
    dateEnd,
}: {
    dataDogEvents: DataDogEventsType[];
    dateStart: Date;
    dateEnd: Date;
}): MonitoringEventType[] => {
    const dateStartTimeStamp = DateUtils.formatDateToTimestamp(dateStart, 'ms');
    const dateEndTimeStamp = DateUtils.formatDateToTimestamp(dateEnd, 'ms');

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
