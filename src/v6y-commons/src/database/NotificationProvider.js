"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppLogger_1 = __importDefault(require("../core/AppLogger"));
const NotificationModel_1 = require("./models/NotificationModel");
/**
 * Format Notification Input
 * @param notification
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
 * Create An Notification
 * @param notification
 */
const createNotification = async (notification) => {
    try {
        AppLogger_1.default.info(`[NotificationProvider - createNotification] notification title:  ${notification?.title}`);
        if (!notification?.title?.length) {
            return null;
        }
        const createdNotification = await NotificationModel_1.NotificationModelType.create(formatNotificationInput(notification));
        AppLogger_1.default.info(`[NotificationProvider - createNotification] createdNotification: ${createdNotification?._id}`);
        return createdNotification;
    }
    catch (error) {
        AppLogger_1.default.info(`[NotificationProvider - createNotification] error:  ${error}`);
        return null;
    }
};
/**
 * Edit an Notification
 * @param notification
 */
const editNotification = async (notification) => {
    try {
        AppLogger_1.default.info(`[NotificationProvider - editNotification] notification id:  ${notification?._id}`);
        AppLogger_1.default.info(`[NotificationProvider - editNotification] notification title:  ${notification?.title}`);
        if (!notification?._id || !notification?.title?.length) {
            return null;
        }
        const editedNotification = await NotificationModel_1.NotificationModelType.update(formatNotificationInput(notification), {
            where: {
                _id: notification?._id,
            },
        });
        AppLogger_1.default.info(`[NotificationProvider - editNotification] editedNotification: ${editedNotification?.[0]}`);
        return {
            _id: notification?._id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[NotificationProvider - editNotification] error:  ${error}`);
        return null;
    }
};
/**
 * Delete Notification
 * @param _id
 */
const deleteNotification = async ({ _id }) => {
    try {
        AppLogger_1.default.info(`[NotificationProvider - deleteNotification] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await NotificationModel_1.NotificationModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[NotificationProvider - deleteNotification] error:  ${error}`);
        return null;
    }
};
/**
 * Delete Notification List
 */
const deleteNotificationList = async () => {
    try {
        await NotificationModel_1.NotificationModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[NotificationProvider - deleteNotificationList] error:  ${error}`);
        return false;
    }
};
/**
 * Get Notification List By Parameters
 * @param start
 * @param limit
 * @param sort
 */
const getNotificationListByPageAndParams = async ({ start, limit, sort }) => {
    try {
        AppLogger_1.default.info(`[NotificationProvider - getNotificationListByPageAndParams] start: ${start}`);
        AppLogger_1.default.info(`[NotificationProvider - getNotificationListByPageAndParams] limit: ${limit}`);
        AppLogger_1.default.info(`[NotificationProvider - getNotificationListByPageAndParams] sort: ${sort}`);
        // Construct the query options based on provided arguments
        const queryOptions = {};
        // Handle pagination
        if (start) {
            // queryOptions.offset = start;
        }
        if (limit) {
            // queryOptions.limit = limit;
        }
        const notificationList = await NotificationModel_1.NotificationModelType.findAll(queryOptions);
        AppLogger_1.default.info(`[NotificationProvider - getNotificationListByPageAndParams] notificationList: ${notificationList?.length}`);
        return notificationList;
    }
    catch (error) {
        AppLogger_1.default.info(`[NotificationProvider - getNotificationListByPageAndParams] error:  ${error}`);
        return [];
    }
};
/**
 * Get details of an NOTIFICATION
 * @param _id
 */
const getNotificationDetailsByParams = async ({ _id }) => {
    try {
        AppLogger_1.default.info(`[NotificationProvider - getNotificationDetailsByParams] _id: ${_id}`);
        if (!_id) {
            return null;
        }
        const notificationDetails = (await NotificationModel_1.NotificationModelType.findOne({
            where: { _id },
        }))?.dataValues;
        AppLogger_1.default.info(`[NotificationProvider - getNotificationDetailsByParams] notificationDetails _id: ${notificationDetails?._id}`);
        if (!notificationDetails?._id) {
            return null;
        }
        return notificationDetails;
    }
    catch (error) {
        AppLogger_1.default.info(`[NotificationProvider - getNotificationDetailsByParams] error: ${error}`);
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
exports.default = NotificationProvider;
