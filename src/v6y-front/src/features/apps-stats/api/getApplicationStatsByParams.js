import { gql } from 'graphql-request';

const GetApplicationStatsByParams = gql`
    query getApplicationStatsByParams($keywords: [String]) {
        getApplicationStatsByParams(keywords: $keywords) {
            keyword {
                label
                version
                status
            }
            total
        }
    }
`;

export default GetApplicationStatsByParams;
