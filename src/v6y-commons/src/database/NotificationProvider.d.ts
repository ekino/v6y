import { NotificationInputType, NotificationType } from '../types/NotificationType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { NotificationModelType } from './models/NotificationModel.ts';
declare const NotificationProvider: {
    createNotification: (notification: NotificationInputType) => Promise<NotificationModelType | null>;
    editNotification: (notification: NotificationInputType) => Promise<{
        _id: number;
    } | null>;
    deleteNotification: ({ _id }: NotificationType) => Promise<{
        _id: number;
    } | null>;
    deleteNotificationList: () => Promise<boolean>;
    getNotificationListByPageAndParams: ({ start, limit, sort }: SearchQueryType) => Promise<NotificationType[]>;
    getNotificationDetailsByParams: ({ _id }: NotificationType) => Promise<NotificationType | null>;
};
export default NotificationProvider;
