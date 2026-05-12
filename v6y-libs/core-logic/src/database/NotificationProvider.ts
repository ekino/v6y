import AppLogger from '../core/AppLogger.ts';
import { NotificationInputType, NotificationType } from '../types/NotificationType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { getPrismaClient } from './PrismaClient.ts';

const formatNotificationInput = (notification: NotificationInputType) => ({
    title: notification.title,
    description: notification.description,
    links:
        notification.links
            ?.map((link) => ({ label: 'More Information', value: link, description: '' }))
            ?.filter((item) => item?.value) ?? [],
});

const createNotification = async (notification: NotificationInputType) => {
    try {
        if (!notification?.title?.length) return null;
        const data = formatNotificationInput(notification);
        const created = await getPrismaClient().notification.create({
            data: { ...data, links: data.links.length ? data.links : undefined },
        });
        return { ...created, _id: created.id };
    } catch (error) {
        AppLogger.error('[NotificationProvider - createNotification] error: ', error);
        return null;
    }
};

const editNotification = async (notification: NotificationInputType) => {
    try {
        if (!notification?._id || !notification?.title?.length) return null;
        const data = formatNotificationInput(notification);
        await getPrismaClient().notification.update({
            where: { id: notification._id },
            data: { ...data, links: data.links.length ? data.links : undefined },
        });
        return { _id: notification._id };
    } catch (error) {
        AppLogger.error('[NotificationProvider - editNotification] error: ', error);
        return null;
    }
};

const deleteNotification = async ({ _id }: NotificationType) => {
    try {
        if (!_id) return null;
        await getPrismaClient().notification.delete({ where: { id: _id } });
        return { _id };
    } catch (error) {
        AppLogger.error('[NotificationProvider - deleteNotification] error: ', error);
        return null;
    }
};

const deleteNotificationList = async () => {
    try {
        await getPrismaClient().notification.deleteMany();
        return true;
    } catch (error) {
        AppLogger.error('[NotificationProvider - deleteNotificationList] error: ', error);
        return false;
    }
};

const getNotificationListByPageAndParams = async ({ start, limit }: SearchQueryType) => {
    try {
        const list = await getPrismaClient().notification.findMany({
            skip: start ?? undefined,
            take: limit ?? undefined,
        });
        return list.map((item) => ({ ...item, _id: item.id }));
    } catch (error) {
        AppLogger.info(
            '[NotificationProvider - getNotificationListByPageAndParams] error: ' + error,
        );
        return [];
    }
};

const getNotificationDetailsByParams = async ({ _id }: NotificationType) => {
    try {
        if (!_id) return null;
        const item = await getPrismaClient().notification.findUnique({ where: { id: _id } });
        if (!item) return null;
        return { ...item, _id: item.id };
    } catch (error) {
        AppLogger.error('[NotificationProvider - getNotificationDetailsByParams] error: ', error);
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
