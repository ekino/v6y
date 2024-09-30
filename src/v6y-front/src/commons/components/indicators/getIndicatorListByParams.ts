import { gql } from 'graphql-request';

const GetIndicatorListByParams = gql`
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

export default GetIndicatorListByParams;
