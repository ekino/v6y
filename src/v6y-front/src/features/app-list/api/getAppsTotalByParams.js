import { gql } from 'graphql-request';

const GetAppsTotalByParams = gql`
    query getAppsTotalByParams($keywords: [String], $searchText: String) {
        getAppsTotalByParams(keywords: $keywords, searchText: $searchText)
    }
`;

export default GetAppsTotalByParams;
