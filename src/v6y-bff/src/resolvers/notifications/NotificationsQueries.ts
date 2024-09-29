import { AppLogger, NotificationProvider, NotificationType, SearchQueryType } from '@v6y/commons';

/**
 * Fetch the Notification list by page and params
 * @param _
 * @param args
 */
const getNotificationListByPageAndParams = async (_: unknown, args: SearchQueryType) => {
    try {
        const { start, limit, sort } = args || {};
        AppLogger.info(
            `[NotificationQueries - getNotificationListByPageAndParams] start : ${start}`,
        );
        AppLogger.info(
            `[NotificationQueries - getNotificationListByPageAndParams] limit : ${limit}`,
        );
        AppLogger.info(`[NotificationQueries - getNotificationListByPageAndParams] sort : ${sort}`);

        // Fetch the Notification list (Note: the provided arguments are not being used in the call)
        const notificationList = await NotificationProvider.getNotificationListByPageAndParams({
            start,
            limit,
            sort,
        });

        AppLogger.info(
            `[NotificationQueries - getNotificationListByPageAndParams] notificationList : ${notificationList?.length}`,
        );

        return notificationList;
    } catch (error) {
        AppLogger.info(
            `[NotificationQueries - getNotificationListByPageAndParams] error : ${error}`,
        );
        return [];
    }
};

/**
 * Fetch the Notification details by params
 * @param _
 * @param args
 */
const getNotificationDetailsByParams = async (_: unknown, args: NotificationType) => {
    try {
        const { _id } = args || {};

        AppLogger.info(`[NotificationQueries - getNotificationDetailsByParams] _id : ${_id}`);

        if (!_id) {
            return null;
        }

        const notificationDetails = await NotificationProvider.getNotificationDetailsByParams({
            _id,
        });

        AppLogger.info(
            `[NotificationQueries - getNotificationDetailsByParams] notificationDetails : ${notificationDetails?._id}`,
        );

        return notificationDetails;
    } catch (error) {
        AppLogger.info(`[NotificationQueries - getNotificationDetailsByParams] error : ${error}`);
        return null;
    }
};

const NotificationQueries = {
    getNotificationListByPageAndParams,
    getNotificationDetailsByParams,
};

export default NotificationQueries;
