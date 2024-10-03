import { gql } from 'graphql-request';

const GetApplicationDetailsQualityIndicatorsByParams = gql`
    query getApplicationDetailsKeywordsByParams($_id: Int) {
        getApplicationDetailsKeywordsByParams(_id: $_id) {
            label
            module {
                branch
                path
                url
                status
            }
        }
    }
`;

export default GetApplicationDetailsQualityIndicatorsByParams;
