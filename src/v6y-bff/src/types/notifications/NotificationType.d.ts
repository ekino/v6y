declare const NotificationType = "\n  type NotificationType {\n    \"\"\" Notification Unique id \"\"\"\n    _id: Int!\n    \n    \"\"\" Notification Title \"\"\"\n    title: String!\n    \n    \"\"\" Notification Description Details \"\"\"\n    description: String!\n    \n    \"\"\" Notification Extra Links \"\"\"\n    links: [LinkType]\n  }\n";
export default NotificationType;
