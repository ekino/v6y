import { FindOptions } from 'sequelize';

import AppLogger from '../core/AppLogger';
import { NotificationInputType, NotificationType } from '../types/NotificationType';
import { SearchQueryType } from '../types/SearchQueryType';
import { NotificationModelType } from './models/NotificationModel';

/**
 * Format Notification Input
 * @param notification
 */
const formatNotificationInput = (notification: NotificationInputType) => ({
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
 * Create An Notification
 * @param notification
 */
const createNotification = async (notification: NotificationInputType) => {
    try {
        AppLogger.info(
            `[NotificationProvider - createNotification] notification title:  ${notification?.title}`,
        );
        if (!notification?.title?.length) {
            return null;
        }

        const createdNotification = await NotificationModelType.create(
            formatNotificationInput(notification),
        );
        AppLogger.info(
            `[NotificationProvider - createNotification] createdNotification: ${createdNotification?._id}`,
        );

        return createdNotification;
    } catch (error) {
        AppLogger.info(`[NotificationProvider - createNotification] error:  ${error}`);
        return null;
    }
};

/**
 * Edit an Notification
 * @param notification
 */
const editNotification = async (notification: NotificationInputType) => {
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

        const editedNotification = await NotificationModelType.update(
            formatNotificationInput(notification),
            {
                where: {
                    _id: notification?._id,
                },
            },
        );

        AppLogger.info(
            `[NotificationProvider - editNotification] editedNotification: ${editedNotification?.[0]}`,
        );

        return {
            _id: notification?._id,
        };
    } catch (error) {
        AppLogger.info(`[NotificationProvider - editNotification] error:  ${error}`);
        return null;
    }
};

/**
 * Delete Notification
 * @param _id
 */
const deleteNotification = async ({ _id }: NotificationType) => {
    try {
        AppLogger.info(`[NotificationProvider - deleteNotification] _id:  ${_id}`);
        if (!_id) {
            return null;
        }

        await NotificationModelType.destroy({
            where: {
                _id,
            },
        });

        return {
            _id,
        };
    } catch (error) {
        AppLogger.info(`[NotificationProvider - deleteNotification] error:  ${error}`);
        return null;
    }
};

/**
 * Delete Notification List
 */
const deleteNotificationList = async () => {
    try {
        await NotificationModelType.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[NotificationProvider - deleteNotificationList] error:  ${error}`);
        return false;
    }
};

/**
 * Get Notification List By Parameters
 * @param start
 * @param limit
 * @param sort
 */
const getNotificationListByPageAndParams = async ({ start, limit, sort }: SearchQueryType) => {
    try {
        AppLogger.info(
            `[NotificationProvider - getNotificationListByPageAndParams] start: ${start}`,
        );
        AppLogger.info(
            `[NotificationProvider - getNotificationListByPageAndParams] limit: ${limit}`,
        );
        AppLogger.info(`[NotificationProvider - getNotificationListByPageAndParams] sort: ${sort}`);

        // Construct the query options based on provided arguments
        const queryOptions: FindOptions = {};

        // Handle pagination
        if (start) {
            // queryOptions.offset = start;
        }

        if (limit) {
            // queryOptions.limit = limit;
        }

        const notificationList = await NotificationModelType.findAll(queryOptions);
        AppLogger.info(
            `[NotificationProvider - getNotificationListByPageAndParams] notificationList: ${notificationList?.length}`,
        );

        return notificationList;
    } catch (error) {
        AppLogger.info(
            `[NotificationProvider - getNotificationListByPageAndParams] error:  ${error}`,
        );
        return [];
    }
};

/**
 * Get details of an NOTIFICATION
 * @param _id
 */
const getNotificationDetailsByParams = async ({ _id }: NotificationType) => {
    try {
        AppLogger.info(`[NotificationProvider - getNotificationDetailsByParams] _id: ${_id}`);

        if (!_id) {
            return null;
        }

        const notificationDetails = (
            await NotificationModelType.findOne({
                where: { _id },
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
        AppLogger.info(`[NotificationProvider - getNotificationDetailsByParams] error: ${error}`);
        return null;
    }
};

const NotificationProvider = {
    createNotification,
    editNotification,
    deleteNotification,
    deleteNotificationList,
    getNotificationListByPageAndParams,
    getNotificationDetailsByParams,
};

export default NotificationProvider;
