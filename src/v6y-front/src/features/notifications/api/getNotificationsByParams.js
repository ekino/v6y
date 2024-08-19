import { gql } from 'graphql-request';

const GetNotificationsByParams = gql`
    query getNotificationsByParams {
        getNotificationsByParams {
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

export default GetNotificationsByParams;
