const NotificationDeleteInput = `
  input NotificationDeleteInputClause {
      """ Notification to delete id """
      _id: String!
  }
  
  input NotificationDeleteInput {
      """ Notification to delete id """
      where: NotificationDeleteInputClause!
  }
`;

export default NotificationDeleteInput;
