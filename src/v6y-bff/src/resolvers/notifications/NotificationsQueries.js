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

const NotificationsQueries = {
    getNotificationsByParams,
};

export default NotificationsQueries;
