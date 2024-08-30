import { gql } from 'graphql-request';

const GetNotificationList = gql`
    query GetNotificationList($start: Int, $limit: Int, $sort: String) {
        getNotificationListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
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

export default GetNotificationList;
