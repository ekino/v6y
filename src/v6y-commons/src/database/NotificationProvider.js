import { notifications } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';

const insertNotification = async (notification) => {
    try {
        AppLogger.info(`[insertNotification] notification title:  ${notification?.title}`);
        if (!notification?.title?.length) {
            return {};
        }

        return null;
    } catch (error) {
        AppLogger.info(`[insertNotification] error:  ${error.message}`);
        return {};
    }
};

const insertNotificationList = async (notificationList) => {
    try {
        if (!notificationList?.length) {
            return;
        }

        for (const notification of notificationList) {
            await insertNotification(notification);
        }
    } catch (error) {
        AppLogger.info(`[insertNotificationList] error:  ${error.message}`);
    }
};

const deleteNotificationsList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[deleteNotificationsList] error:  ${error.message}`);
    }
};

const getNotificationsByParams = async () => {
    try {
        return notifications;
    } catch (error) {
        AppLogger.info(`[getNotificationsByParams] error:  ${error.message}`);
        return [];
    }
};

const NotificationProvider = {
    insertNotificationList,
    deleteNotificationsList,
    getNotificationsByParams,
};

export default NotificationProvider;
