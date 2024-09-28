declare const NotificationQueriesType = "\n  type Query {\n    getNotificationListByPageAndParams(start: Int, offset: Int, limit: Int, keywords: [String], searchText: String, where: JSON, sort: String): [NotificationType]\n    getNotificationDetailsByParams(_id: Int!): NotificationType\n  }\n";
export default NotificationQueriesType;
