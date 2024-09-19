import { gql } from 'graphql-request';

const GetNotificationDetailsByParams = gql`
    query GetNotificationDetailsByParams($notificationId: String!) {
        getNotificationDetailsByParams(notificationId: $notificationId) {
            id: _id
            title
            description
            links {
                label
                value
                description
            }
        }
    }
`;

export default GetNotificationDetailsByParams;
