import { NotificationType, SearchQueryType } from '@v6y/commons';
declare const NotificationQueries: {
    getNotificationListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<NotificationType[]>;
    getNotificationDetailsByParams: (_: unknown, args: NotificationType) => Promise<NotificationType | null>;
};
export default NotificationQueries;
