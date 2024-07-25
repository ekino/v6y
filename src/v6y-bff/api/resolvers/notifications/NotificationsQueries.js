import { NotificationsConfig } from "@v6y/commons";

const getNotificationListByPageAndParams = () => {
  return NotificationsConfig.buildData();
};

const NotificationsQueries = {
  getNotificationListByPageAndParams,
};

export default NotificationsQueries;
