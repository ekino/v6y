import { gql } from 'graphql-request';

const GetNotificationDetails = gql`
    query GetNotificationDetails($notificationId: String!) {
        getNotificationDetailsInfosByParams(notificationId: $notificationId) {
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

export default GetNotificationDetails;
