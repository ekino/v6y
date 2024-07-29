import AppResolvers from './app/AppResolvers.js';
import FaqResolvers from './faq/FaqResolvers.js';
import NotificationsResolvers from './notifications/NotificationsResolvers.js';

const VitalityResolvers = {
  Query: {
    ...AppResolvers.Query,
    ...FaqResolvers.Query,
    ...NotificationsResolvers.Query,
  },
};

export default VitalityResolvers;
