import { NotificationType, SearchQueryType } from '@v6y/commons';
declare const NotificationQueries: {
    getNotificationListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<import("@v6y/commons/src/database/models/NotificationModel.ts").NotificationModelType[]>;
    getNotificationDetailsByParams: (_: unknown, args: NotificationType) => Promise<NotificationType | null>;
};
export default NotificationQueries;
