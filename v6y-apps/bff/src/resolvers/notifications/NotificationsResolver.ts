import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import NotificationMutations from './NotificationMutations.ts';
import NotificationsQueries from './NotificationsQueries.ts';

/**
 * Schema-first GraphQL resolver for the Notifications domain. Operation names
 * match the SDL fragments declared in src/types/notifications/*. Each handler
 * delegates to the original implementation so the runtime behavior stays
 * identical to the previous Apollo-on-Express setup.
 */
@Resolver()
export class NotificationsResolver {
    @Query('getNotificationListByPageAndParams')
    getNotificationListByPageAndParams(
        @Args() args: Parameters<typeof NotificationsQueries.getNotificationListByPageAndParams>[1],
    ) {
        return NotificationsQueries.getNotificationListByPageAndParams(undefined, args);
    }

    @Query('getNotificationDetailsByParams')
    getNotificationDetailsByParams(
        @Args() args: Parameters<typeof NotificationsQueries.getNotificationDetailsByParams>[1],
    ) {
        return NotificationsQueries.getNotificationDetailsByParams(undefined, args);
    }

    @Mutation('createOrEditNotification')
    createOrEditNotification(
        @Args() args: Parameters<typeof NotificationMutations.createOrEditNotification>[1],
    ) {
        return NotificationMutations.createOrEditNotification(undefined, args);
    }

    @Mutation('deleteNotification')
    deleteNotification(
        @Args() args: Parameters<typeof NotificationMutations.deleteNotification>[1],
    ) {
        return NotificationMutations.deleteNotification(undefined, args);
    }
}
