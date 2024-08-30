import { AppLogger, NotificationProvider } from '@v6y/commons';

const getNotificationsByParams = async () => {
    try {
        const notificationList = await NotificationProvider.getNotificationsByParams();

        AppLogger.info(
            `[NotificationsQueries - getNotificationsByParams] notificationList : ${notificationList?.length}`,
        );

        return notificationList;
    } catch (error) {
        AppLogger.info(
            `[NotificationsQueries - getNotificationsByParams] error : ${error.message}`,
        );
        return [];
    }
};

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

        const notificationList = await NotificationProvider.getNotificationsByParams();

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

const getNotificationDetailsInfosByParams = async (_, args) => {
    try {
        const { notificationId } = args || {};

        AppLogger.info(
            `[NotificationQueries - getNotificationDetailsInfosByParams] notificationId : ${notificationId}`,
        );

        const appDetails = await NotificationProvider.getNotificationDetailsInfosByParams({
            notificationId,
        });

        AppLogger.info(
            `[NotificationQueries - getNotificationDetailsInfosByParams] appDetails : ${appDetails?._id}`,
        );

        return appDetails;
    } catch (error) {
        AppLogger.info(
            `[NotificationQueries - getNotificationDetailsInfosByParams] error : ${error.message}`,
        );
        return {};
    }
};

const NotificationsQueries = {
    getNotificationsByParams,
    getNotificationListByPageAndParams,
    getNotificationDetailsInfosByParams,
};

export default NotificationsQueries;
