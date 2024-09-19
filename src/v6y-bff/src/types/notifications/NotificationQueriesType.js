const NotificationQueriesType = `
  type Query {
    getNotificationListByPageAndParams(start: Int, offset: Int, limit: Int, keywords: [String], searchText: String, where: JSON, sort: String): [NotificationType]
    getNotificationDetailsByParams(notificationId: String!): NotificationType
  }
`;

export default NotificationQueriesType;
