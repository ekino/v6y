import { gql } from 'graphql-request';

const GetApplicationTotalByParams = gql`
    query getApplicationTotalByParams($keywords: [String], $searchText: String) {
        getApplicationTotalByParams(keywords: $keywords, searchText: $searchText)
    }
`;

export default GetApplicationTotalByParams;
