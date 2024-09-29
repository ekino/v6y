import { gql } from 'graphql-request';

const GetNotificationListByPageAndParams = gql`
    query getNotificationListByPageAndParams {
        getNotificationListByPageAndParams {
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

export default GetNotificationListByPageAndParams;
