import { gql } from 'graphql-request';

const GetNotificationDetailsByParams = gql`
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
`;

export default GetNotificationDetailsByParams;
