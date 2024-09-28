import { NotificationInputType, SearchQueryType } from '@v6y/commons';
declare const NotificationMutations: {
    createOrEditNotification: (_: unknown, params: {
        notificationInput: NotificationInputType;
    }) => Promise<import("@v6y/commons/src/database/models/NotificationModel.ts").NotificationModelType | {
        _id: number;
    } | null>;
    deleteNotification: (_: unknown, params: {
        input: SearchQueryType;
    }) => Promise<{
        _id: number;
    } | null>;
};
export default NotificationMutations;
