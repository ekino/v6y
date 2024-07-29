import { gql } from 'graphql-request';

const GetAppTotalNumber = gql`
    query getAppTotalNumber($keywords: [String], $searchText: String) {
        getAppTotalNumber(keywords: $keywords, searchText: $searchText)
    }
`;

export default GetAppTotalNumber;
