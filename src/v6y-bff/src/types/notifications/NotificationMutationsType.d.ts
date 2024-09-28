declare const NotificationMutationsType = "\n  type Mutation {\n    createOrEditNotification(notificationInput: NotificationCreateOrEditInput!): NotificationType\n    deleteNotification(input: NotificationDeleteInput!): NotificationDeleteOutput\n  }\n";
export default NotificationMutationsType;
