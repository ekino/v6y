import { gql } from 'graphql-request';

const GetNotificationList = gql`
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

export default GetNotificationList;
