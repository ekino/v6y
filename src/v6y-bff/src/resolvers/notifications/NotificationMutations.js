import { AppLogger, NotificationProvider } from '@v6y/commons';

/**
 * Creates or edits a Notification entry.
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the Notification input data.
 * @returns An object representing the created or edited Notification entry,
 * or an empty object on error.
 */
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

        if (notificationId) {
            const editedNotification = await NotificationProvider.editNotification({
                _id: notificationId,
                title,
                description,
                links,
            });

            AppLogger.info(
                `[NotificationMutations - createOrEditNotification] editedNotification : ${editedNotification?._id}`,
            );

            return {
                _id: notificationId,
            };
        }

        const createdNotification = await NotificationProvider.createNotification({
            title,
            description,
            links,
        });

        AppLogger.info(
            `[NotificationMutations - createOrEditNotification] createdNotification : ${createdNotification?._id}`,
        );

        return createdNotification;
    } catch (error) {
        AppLogger.info(
            `[NotificationMutations - createOrEditNotification] error : ${error.message}`,
        );
        return null;
    }
};

/**
 * Deletes a Notification entry
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the input data with the Notification ID to delete
 * @returns An object containing the deleted Notification ID or an empty object on error.
 */
const deleteNotification = async (_, params) => {
    try {
        const notificationId = params?.input?.where?.id || {};

        AppLogger.info(
            `[NotificationMutations - deleteNotification] notificationId : ${notificationId}`,
        );

        await NotificationProvider.deleteNotification({ notificationId });

        return {
            _id: notificationId,
        };
    } catch (error) {
        AppLogger.info(`[NotificationMutations - deleteNotification] error : ${error.message}`);
        return null;
    }
};

/**
 * An object containing Notification mutation functions
 */
const NotificationMutations = {
    createOrEditNotification,
    deleteNotification,
};

export default NotificationMutations;
