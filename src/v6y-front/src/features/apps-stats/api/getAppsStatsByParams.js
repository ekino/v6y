import { gql } from 'graphql-request';

const GetAppsStatsByParams = gql`
    query getAppsStatsByParams($keywords: [String]) {
        getAppsStatsByParams(keywords: $keywords) {
            keyword
            total
        }
    }
`;

export default GetAppsStatsByParams;
