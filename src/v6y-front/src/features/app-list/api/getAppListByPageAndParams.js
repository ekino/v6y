import { gql } from 'graphql-request';

const GetAppListByPageAndParams = gql`
    query getAppListByPageAndParams(
        $offset: Int
        $limit: Int
        $keywords: [String]
        $searchText: String
    ) {
        getAppListByPageAndParams(
            offset: $offset
            limit: $limit
            keywords: $keywords
            searchText: $searchText
        ) {
            _id
            name
            acronym
            description
            keywords {
                label
                version
                status
                helpMessage
            }
        }
    }
`;

export default GetAppListByPageAndParams;
