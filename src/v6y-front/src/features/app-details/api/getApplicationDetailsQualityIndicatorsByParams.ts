import { gql } from 'graphql-request';

const GetApplicationDetailsQualityIndicatorsByParams = gql`
    query getApplicationDetailsKeywordsByParams($appId: String) {
        getApplicationDetailsKeywordsByParams(appId: $appId) {
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
