import { gql } from 'graphql-request';

const GetApplicationStatsByParams = gql`
    query getApplicationStatsByParams($keywords: [String]) {
        getApplicationStatsByParams(keywords: $keywords) {
            keyword {
                label
            }
            total
        }
    }
`;

export default GetApplicationStatsByParams;
