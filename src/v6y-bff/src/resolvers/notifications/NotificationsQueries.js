import { AppLogger, NotificationProvider } from '@v6y/commons';

/**
 * Retrieves a list of Notifications based on pagination and filtering parameters.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including:
 *   - `start` (number): The starting index for pagination.
 *   - `limit` (number): The maximum number of Notifications to retrieve.
 *   - `sort` (object): An optional object defining the sorting criteria.
 * @returns An array of Notification entries matching the criteria or an empty array on error
 */
const getNotificationListByPageAndParams = async (_, args) => {
    try {
        const { start, limit, sort } = args || {};
        // Log the input parameters for debugging/tracking purposes
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
            `[NotificationQueries - getNotificationListByPageAndParams] error : ${error.message}`,
        );
        return [];
    }
};

/**
 * Retrieves the details of a specific Notification by its ID
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing the query arguments, including 'notificationId'
 * @returns An object containing the Notification details or an empty object if not found or on error.
 */
const getNotificationDetailsByParams = async (_, args) => {
    try {
        const { notificationId } = args || {};

        AppLogger.info(
            `[NotificationQueries - getNotificationDetailsByParams] notificationId : ${notificationId}`,
        );

        if (!notificationId) {
            return null;
        }

        const notificationDetails = await NotificationProvider.getNotificationDetailsByParams({
            notificationId,
        });

        AppLogger.info(
            `[NotificationQueries - getNotificationDetailsByParams] notificationDetails : ${notificationDetails?._id}`,
        );

        return notificationDetails;
    } catch (error) {
        AppLogger.info(
            `[NotificationQueries - getNotificationDetailsByParams] error : ${error.message}`,
        );
        return null;
    }
};

/**
 * An object containing Notification query functions
 */
const NotificationQueries = {
    getNotificationListByPageAndParams,
    getNotificationDetailsByParams,
};

export default NotificationQueries;
