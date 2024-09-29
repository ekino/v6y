import { gql } from 'graphql-request';

const GetIndicatorListByParams = gql`
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

export default GetIndicatorListByParams;
