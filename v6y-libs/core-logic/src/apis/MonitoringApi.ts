import AppLogger from '../core/AppLogger.ts';
import { DataDogConfigType } from '../types/ApplicationConfigType.ts';
import { DataDogEventsType, GetEventsOptions } from '../types/MonitoringType.ts';
import DateUtils from '../utils/DateUtils.ts';
import MonitoringUtils from '../utils/MonitoringUtils.ts';

const { formatStringToTimeStamp } = DateUtils;
const { convertDataDogEventsToMonitoringEvents } = MonitoringUtils;

/**
 * Fetches DataDog events for a given application.
 * @param application
 * @param dateStartTimeStamp
 * @param dateEndTimeStamp
 **/
const fetchDataDogEvents = async ({
    dataDogConfig,
    dateStartTimeStamp,
    dateEndTimeStamp,
}: {
    dataDogConfig: DataDogConfigType;
    dateStartTimeStamp: number;
    dateEndTimeStamp: number;
}): Promise<DataDogEventsType[]> => {
    if (
        !dataDogConfig ||
        !dataDogConfig.url ||
        !dataDogConfig.monitorId ||
        !dataDogConfig.apiKey ||
        !dataDogConfig.appKey
    ) {
        AppLogger.error(`[EventApi - fetchDataDogEvents] DataDog configuration is missing`);
        return [];
    }

    const url = `${dataDogConfig.url}/api/v2/events?filter[monitor_id]=${dataDogConfig.monitorId}&filter[from]=${dateStartTimeStamp}&filter[to]=${dateEndTimeStamp}&sort=timestamp&page[limit]=1000`;

    const headers = {
        'Content-Type': 'application/json',
        'DD-API-KEY': dataDogConfig.apiKey,
        'DD-APPLICATION-KEY': dataDogConfig.appKey,
    };

    AppLogger.info(`[EventApi - fetchDataDogEvents] Fetching DataDog events: ${url}`);

    const response = await fetch(url, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        AppLogger.error(
            `[EventApi - fetchDataDogEvents] Error fetching DataDog events: ${response.statusText}`,
        );
        return [];
    }

    const data = await response.json();

    AppLogger.info(`[EventApi - fetchDataDogEvents] DataDog events fetched successfully`);

    return data?.data || [];
};

/**
 * Fetches events for a given application.
 * @param application
 * @param dateStartStr
 * @param dateEndStr
 **/
const getMonitoringEvents = async ({ application, dateStartStr, dateEndStr }: GetEventsOptions) => {
    try {
        AppLogger.info(
            `[EventApi - getEvents] Fetching events for application: ${application._id}`,
        );
        if (!application || !application.configuration?.dataDog) {
            AppLogger.error(
                `[EventApi - getEvents] Application or DataDog configuration is missing`,
            );
            return [];
        }

        const dateStartTimeStamp = formatStringToTimeStamp(dateStartStr, 'ms');
        const dateEndTimeStamp = formatStringToTimeStamp(dateEndStr, 'ms');

        const dataDogEvents = await fetchDataDogEvents({
            dataDogConfig: application.configuration.dataDog,
            dateStartTimeStamp,
            dateEndTimeStamp,
        });

        const convertedEvents = convertDataDogEventsToMonitoringEvents({
            dataDogEvents,
            dateStartTimeStamp,
            dateEndTimeStamp,
        });

        AppLogger.info(
            `[EventApi - getEvents] Events fetched successfully: ${convertedEvents.length}`,
        );

        return convertedEvents;
    } catch (error) {
        AppLogger.error(
            `[EventApi - getEvents] An exception occurred during the events fetching: ${error}`,
        );
        return [];
    }
};

const MonitoringApi = {
    getMonitoringEvents,
};

export default MonitoringApi;
