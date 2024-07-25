import { gql } from 'graphql-request';

const GET_APP_TOTAL_NUMBER = gql`
    query getAppTotalNumber($keywords: [String], $searchText: String) {
        getAppTotalNumber(keywords: $keywords, searchText: $searchText)
    }
`;

export default GET_APP_TOTAL_NUMBER;
