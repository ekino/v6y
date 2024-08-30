const NotificationQueriesType = `
  type Query {
    getNotificationsByParams: [NotificationType]
    getNotificationListByPageAndParams(start: Int, offset: Int, limit: Int, keywords: [String], searchText: String, where: JSON, sort: String): [NotificationType]
    getNotificationDetailsInfosByParams(notificationId: String!): NotificationType
  }
`;

export default NotificationQueriesType;
