import NotificationMutations from './NotificationMutations.ts';
import NotificationsQueries from './NotificationsQueries.ts';

const NotificationsResolvers = {
    Query: {
        ...NotificationsQueries,
    },
    Mutation: {
        ...NotificationMutations,
    },
};

export default NotificationsResolvers;
