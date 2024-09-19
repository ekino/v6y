import AppLogger from '../core/AppLogger.js';
import DataBaseManager from './DataBaseManager.js';
import NotificationModel from './models/NotificationModel.js';

/**
 * Format notification
 * @param notification
 * @returns {{description, links: *, _id: *, title}}
 */
const formatNotificationInput = (notification) => ({
    _id: notification?._id,
    title: notification.title,
    description: notification.description,
    links: notification.links
        ?.map((link) => ({
            label: 'More Information',
            value: link,
            description: '',
        }))
        ?.filter((item) => item?.value),
});

/**
 * Creates a new Notification entry in the database.
 *
 * @param {Object} notification - The Notification data to be created.
 * @returns {Promise<*|null>} The created Notification object or null on error or if the Notification model is not found.
 */
const createNotification = async (notification) => {
    try {
        AppLogger.info(
            `[NotificationProvider - createNotification] notification title:  ${notification?.title}`,
        );

        if (!notification?.title?.length) {
            return null;
        }

        const notificationModel = DataBaseManager.getDataBaseSchema(NotificationModel.name);

        if (!notificationModel) {
            return null;
        }

        const createdNotification = await notificationModel.create(
            formatNotificationInput(notification),
        );
        AppLogger.info(
            `[NotificationProvider - createNotification] createdNotification: ${createdNotification?._id}`,
        );

        return createdNotification;
    } catch (error) {
        AppLogger.info(`[NotificationProvider - createNotification] error:  ${error.message}`);
        return null;
    }
};

/**
 * Edits an existing Notification entry in the database.
 *
 * @param {Object} notification - The Notification data with updated information.
 * @returns {Promise<*|null>} An object containing the ID of the edited Notification or null on error or if the Notification model is not found.
 */
const editNotification = async (notification) => {
    try {
        AppLogger.info(
            `[NotificationProvider - editNotification] notification id:  ${notification?._id}`,
        );
        AppLogger.info(
            `[NotificationProvider - editNotification] notification title:  ${notification?.title}`,
        );

        if (!notification?._id || !notification?.title?.length) {
            return null;
        }

        const notificationModel = DataBaseManager.getDataBaseSchema(NotificationModel.name);

        if (!notificationModel) {
            return null;
        }

        const editedNotification = await notificationModel.update(
            formatNotificationInput(notification),
            {
                where: {
                    _id: notification?._id,
                },
            },
        );

        AppLogger.info(
            `[NotificationProvider - editNotification] editedNotification: ${editedNotification?._id}`,
        );

        return {
            _id: notification?.notificationId,
        };
    } catch (error) {
        AppLogger.info(`[NotificationProvider - editNotification] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes a Notification from the database.
 *
 * @param {Object} params - An object containing the parameters for deletion.
 * @param {string} params.notificationId - The ID of the Notification to delete.
 * @returns {Promise<*|null>} An object containing the ID of the deleted Notification, or null on error or if notificationId is not provided or if the Notification model is not found.
 */
const deleteNotification = async ({ notificationId }) => {
    try {
        AppLogger.info(
            `[NotificationProvider - deleteNotification] notificationId:  ${notificationId}`,
        );
        if (!notificationId) {
            return null;
        }

        const notificationModel = DataBaseManager.getDataBaseSchema(NotificationModel.name);

        if (!notificationModel) {
            return null;
        }

        await notificationModel.destroy({
            where: {
                _id: notificationId,
            },
        });

        return {
            _id: notificationId,
        };
    } catch (error) {
        AppLogger.info(`[NotificationProvider - deleteNotification] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes all Notifications from the database
 *
 * @returns {Promise<*|null>} True if the deletion was successful, false otherwise
 */
const deleteNotificationList = async () => {
    try {
        const notificationModel = DataBaseManager.getDataBaseSchema(NotificationModel.name);
        if (!notificationModel) {
            return null;
        }

        await notificationModel.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[NotificationProvider - deleteNotificationList] error:  ${error.message}`);
        return false;
    }
};

/**
 * Retrieves a list of Notifications, potentially paginated and sorted
 *
 * @param {Object} params - An object containing query parameters
 * @param {number} [params.start] - The starting index for pagination (optional)
 * @param {number} [params.limit] - The maximum number of Notifications to retrieve (optional)
 * @param {Object} [params.sort] - An object defining the sorting criteria (optional)
 * @returns {Promise<*|null>} An array of Notification objects or null on error or if the Notification model is not found
 */
const getNotificationListByPageAndParams = async ({ start, limit, sort }) => {
    try {
        AppLogger.info(
            `[NotificationProvider - getNotificationListByPageAndParams] start: ${start}`,
        );
        AppLogger.info(
            `[NotificationProvider - getNotificationListByPageAndParams] limit: ${limit}`,
        );
        AppLogger.info(`[NotificationProvider - getNotificationListByPageAndParams] sort: ${sort}`);

        const notificationModel = DataBaseManager.getDataBaseSchema(NotificationModel.name);
        if (!notificationModel) {
            return null;
        }

        // Construct the query options based on provided arguments
        const queryOptions = {};

        // Handle pagination
        if (start) {
            // queryOptions.offset = start;
        }

        if (limit) {
            // queryOptions.limit = limit;
        }

        const notificationList = await notificationModel.findAll(queryOptions);
        AppLogger.info(
            `[NotificationProvider - getNotificationListByPageAndParams] notificationList: ${notificationList?.length}`,
        );

        return notificationList;
    } catch (error) {
        AppLogger.info(
            `[NotificationProvider - getNotificationListByPageAndParams] error:  ${error.message}`,
        );
        return [];
    }
};

/**
 * Retrieves the details of a Notification by its ID.
 *
 * @param {Object} params - An object containing the parameters for the query
 * @param {string} params.notificationId - The ID of the Notification to retrieve
 * @returns {Promise<*|null>}The Notification details or null if not found or on error or if the Notification model is not found
 */
const getNotificationDetailsByParams = async ({ notificationId }) => {
    try {
        AppLogger.info(
            `[NotificationProvider - getNotificationDetailsByParams] notificationId: ${notificationId}`,
        );

        if (!notificationId?.length) {
            return null;
        }

        const notificationModel = DataBaseManager.getDataBaseSchema(NotificationModel.name);

        if (!notificationModel) {
            return null;
        }

        const notificationDetails = (
            await notificationModel.findOne({
                where: { _id: notificationId },
            })
        )?.dataValues;

        AppLogger.info(
            `[NotificationProvider - getNotificationDetailsByParams] notificationDetails _id: ${notificationDetails?._id}`,
        );

        if (!notificationDetails?._id) {
            return null;
        }

        return notificationDetails;
    } catch (error) {
        AppLogger.info(
            `[NotificationProvider - getNotificationDetailsByParams] error: ${error.message}`,
        );
        return null;
    }
};

/**
 * An object that provides various operations related to Notifications.
 */
const NotificationProvider = {
    createNotification,
    editNotification,
    deleteNotification,
    deleteNotificationList,
    getNotificationListByPageAndParams,
    getNotificationDetailsByParams,
};

export default NotificationProvider;
