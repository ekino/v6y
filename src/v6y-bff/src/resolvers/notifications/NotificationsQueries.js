import { AppLogger, NotificationProvider } from '@v6y/commons';

const getNotificationListByPageAndParams = async (_, args) => {
    try {
        const { start, offset, limit, keywords, searchText, where, sort } = args || {};

        AppLogger.info(
            `[NotificationQueries - getNotificationListByPageAndParams] start : ${start}`,
        );
        AppLogger.info(
            `[NotificationQueries - getNotificationListByPageAndParams] offset : ${offset}`,
        );
        AppLogger.info(
            `[NotificationQueries - getNotificationListByPageAndParams] limit : ${limit}`,
        );
        AppLogger.info(
            `[NotificationQueries - getNotificationListByPageAndParams] keywords : ${keywords?.join?.(',') || ''}`,
        );
        AppLogger.info(
            `[NotificationQueries - getNotificationListByPageAndParams] searchText : ${searchText}`,
        );
        AppLogger.info(
            `[NotificationQueries - getNotificationListByPageAndParams] where : ${where}`,
        );
        AppLogger.info(`[NotificationQueries - getNotificationListByPageAndParams] sort : ${sort}`);

        const notificationList = await NotificationProvider.getNotificationListByPageAndParams();

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

const getNotificationDetailsByParams = async (_, args) => {
    try {
        const { notificationId } = args || {};

        AppLogger.info(
            `[NotificationQueries - getNotificationDetailsByParams] notificationId : ${notificationId}`,
        );

        const appDetails = await NotificationProvider.getNotificationDetailsByParams({
            notificationId,
        });

        AppLogger.info(
            `[NotificationQueries - getNotificationDetailsByParams] appDetails : ${appDetails?._id}`,
        );

        return appDetails;
    } catch (error) {
        AppLogger.info(
            `[NotificationQueries - getNotificationDetailsByParams] error : ${error.message}`,
        );
        return {};
    }
};

const NotificationsQueries = {
    getNotificationListByPageAndParams,
    getNotificationDetailsByParams,
};

export default NotificationsQueries;
