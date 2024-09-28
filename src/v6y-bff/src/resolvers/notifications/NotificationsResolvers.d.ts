declare const NotificationsResolvers: {
    Query: {
        getNotificationListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons/src/database/models/NotificationModel.ts").NotificationModelType[]>;
        getNotificationDetailsByParams: (_: unknown, args: import("@v6y/commons").NotificationType) => Promise<import("@v6y/commons").NotificationType | null>;
    };
    Mutation: {
        createOrEditNotification: (_: unknown, params: {
            notificationInput: import("@v6y/commons").NotificationInputType;
        }) => Promise<import("@v6y/commons/src/database/models/NotificationModel.ts").NotificationModelType | {
            _id: number;
        } | null>;
        deleteNotification: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: number;
        } | null>;
    };
};
export default NotificationsResolvers;
