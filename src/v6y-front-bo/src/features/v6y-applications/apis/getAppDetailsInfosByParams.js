import { gql } from 'graphql-request';

const GetAppDetailsInfosByParams = gql`
    query GetAppDetailsInfosByParams($appId: String) {
        getAppDetailsInfosByParams(appId: $appId) {
            id: _id
            name
            acronym
            description
        }
    }
`;

export default GetAppDetailsInfosByParams;
