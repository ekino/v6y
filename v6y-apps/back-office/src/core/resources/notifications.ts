import type { ResourceConfig } from './types.ts';

const notifications: ResourceConfig = {
    name: 'v6y-notifications',
    label: 'Notifications',
    canCreate: true,
    canDelete: true,
    fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'links', label: 'Extra links', type: 'links', hideInList: true },
    ],
    graphql: {
        listQuery: `
            query GetNotificationListByPageAndParams($start: Int, $limit: Int, $sort: String) {
                getNotificationListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
                    _id
                    title
                    description
                    links {
                        label
                        value
                        description
                    }
                }
            }
        `,
        listField: 'getNotificationListByPageAndParams',
        listSupportsPagination: true,
        listSupportsSort: true,
        detailQuery: `
            query GetNotificationDetailsByParams($_id: Int!) {
                getNotificationDetailsByParams(_id: $_id) {
                    _id
                    title
                    description
                    links {
                        label
                        value
                        description
                    }
                }
            }
        `,
        detailField: 'getNotificationDetailsByParams',
        createOrEditMutation: `
            mutation CreateOrEditNotification($notificationInput: NotificationCreateOrEditInput!) {
                createOrEditNotification(notificationInput: $notificationInput) {
                    _id
                }
            }
        `,
        createOrEditField: 'createOrEditNotification',
        createOrEditArgName: 'notificationInput',
        deleteMutation: `
            mutation DeleteNotification($input: NotificationDeleteInput!) {
                deleteNotification(input: $input) {
                    _id
                }
            }
        `,
        deleteField: 'deleteNotification',
    },
};

export default notifications;
