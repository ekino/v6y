import { NotificationsConfig } from "@v6y/commons";

const getNotificationList = () => {
  return NotificationsConfig.buildData();
};

const NotificationsQueries = {
  getNotificationList,
};

export default NotificationsQueries;
