import AppLogger from '../core/AppLogger.ts';
import {
    DataDogEventsType,
    GetEventsOptions,
    fetchDataDogEventsParamsType,
} from '../types/MonitoringType.ts';
import DateUtils from '../utils/DateUtils.ts';
import MonitoringUtils from '../utils/MonitoringUtils.ts';

const { formatDateToTimestamp } = DateUtils;
const { convertDataDogEventsToMonitoringEvents } = MonitoringUtils;

/**
 * Fetches DataDog events for a given application.
 * @param application
 * @param dateStartTimeStamp
 * @param dateEndTimeStamp
 **/
const fetchDataDogEvents = async ({
    dataDogConfig,
    dateStart,
    dateEnd,
}: fetchDataDogEventsParamsType): Promise<DataDogEventsType[]> => {
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

    const dateStartTimeStamp = formatDateToTimestamp(dateStart, 'ms');
    const dateEndTimeStamp = formatDateToTimestamp(dateEnd, 'ms');

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
 * @param dateStart
 * @param dateEnd
 **/
const getMonitoringEvents = async ({ application, dateStart, dateEnd }: GetEventsOptions) => {
    try {
        AppLogger.info(
            `[EventApi - getEvents] Fetching events for application: ${application._id}`,
        );

        AppLogger.info(
            `[EventApi - getEvents] Application configuration exists: ${!!application.configuration}`,
        );
        AppLogger.info(
            `[EventApi - getEvents] DataDog config exists: ${!!application.configuration?.dataDog}`,
        );

        if (application.configuration?.dataDog) {
            const { dataDog } = application.configuration;
            AppLogger.info(
                `[EventApi - getEvents] DataDog config - url: ${!!dataDog.url}, monitorId: ${!!dataDog.monitorId}, apiKey: ${!!dataDog.apiKey}, appKey: ${!!dataDog.appKey}`,
            );
        }

        if (!application || !application.configuration?.dataDog) {
            AppLogger.error(
                `[EventApi - getEvents] Application or DataDog configuration is missing`,
            );
            return [];
        }

        const dataDogEvents = await fetchDataDogEvents({
            dataDogConfig: application.configuration.dataDog,
            dateStart,
            dateEnd,
        });

        const convertedEvents = convertDataDogEventsToMonitoringEvents({
            dataDogEvents,
            dateStart,
            dateEnd,
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
