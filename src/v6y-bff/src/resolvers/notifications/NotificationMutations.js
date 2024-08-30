import { AppLogger } from '@v6y/commons';

const createOrEditNotification = async (_, params) => {
    try {
        const { notificationId, title, description, links } = params?.notificationInput || {};

        AppLogger.info(
            `[NotificationMutations - createOrEditNotification] notificationId : ${notificationId}`,
        );
        AppLogger.info(`[NotificationMutations - createOrEditNotification] title : ${title}`);
        AppLogger.info(
            `[NotificationMutations - createOrEditNotification] description : ${description}`,
        );
        AppLogger.info(
            `[NotificationMutations - createOrEditNotification] links : ${links?.join(',')}`,
        );

        return {
            _id: notificationId || 'BZ987',
            title,
            description,
            links,
        };
    } catch (error) {
        AppLogger.info(
            `[NotificationMutations - createOrEditNotification] error : ${error.message}`,
        );
        return {};
    }
};

const deleteNotification = async (_, params) => {
    try {
        const notificationId = params?.input?.where?.id || {};
        AppLogger.info(
            `[NotificationMutations - deleteNotification] notificationId : ${notificationId}`,
        );

        return {
            _id: notificationId,
        };
    } catch (error) {
        AppLogger.info(`[NotificationMutations - deleteNotification] error : ${error.message}`);
        return {};
    }
};

const NotificationMutations = {
    createOrEditNotification,
    deleteNotification,
};

export default NotificationMutations;
