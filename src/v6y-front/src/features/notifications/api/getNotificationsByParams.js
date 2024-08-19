import { gql } from 'graphql-request';

const GetNotificationsByParams = gql`
    query getNotificationsByParams {
        getNotificationsByParams {
            _id
            title
            color
            description
            links {
                label
                value
                description
            }
        }
    }
`;

export default GetNotificationsByParams;
