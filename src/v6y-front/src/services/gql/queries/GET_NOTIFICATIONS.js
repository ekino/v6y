import { gql } from 'graphql-request';

const GET_NOTIFICATIONS = gql`
    query getNotificationList {
        getNotificationList {
            title
            color
            description
            links {
                type
                label
                value
                description
            }
        }
    }
`;

export default GET_NOTIFICATIONS;
