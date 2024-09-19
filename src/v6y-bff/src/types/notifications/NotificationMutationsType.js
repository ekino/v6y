const NotificationMutationsType = `
  type Mutation {
    createOrEditNotification(notificationInput: NotificationCreateOrEditInput!): NotificationType
    deleteNotification(input: NotificationDeleteInput!): NotificationDeleteOutput
  }
`;

export default NotificationMutationsType;
