declare const NotificationDeleteInput = "\n  input NotificationDeleteInputClause {\n      \"\"\" Notification to delete id \"\"\"\n      _id: Int!\n  }\n  \n  input NotificationDeleteInput {\n      \"\"\" Notification to delete id \"\"\"\n      where: NotificationDeleteInputClause!\n  }\n";
export default NotificationDeleteInput;
