import AppResolvers from './app/AppResolvers.js';
import FaqResolvers from './faq/FaqResolvers.js';
import KeywordResolvers from './keyword/KeywordResolvers.js';
import NotificationsResolvers from './notifications/NotificationsResolvers.js';

const VitalityResolvers = {
    Query: {
        ...AppResolvers.Query,
        ...FaqResolvers.Query,
        ...NotificationsResolvers.Query,
        ...KeywordResolvers.Query,
    },
};

export default VitalityResolvers;
