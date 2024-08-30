import NotificationMutations from './NotificationMutations.js';
import NotificationsQueries from './NotificationsQueries.js';

const NotificationsResolvers = {
    Query: {
        ...NotificationsQueries,
    },
    Mutation: {
        ...NotificationMutations,
    },
};

export default NotificationsResolvers;
