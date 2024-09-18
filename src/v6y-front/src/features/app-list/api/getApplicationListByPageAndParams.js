import { gql } from 'graphql-request';

const GetApplicationListByPageAndParams = gql`
    query getApplicationListByPageAndParams(
        $offset: Int
        $limit: Int
        $keywords: [String]
        $searchText: String
    ) {
        getApplicationListByPageAndParams(
            offset: $offset
            limit: $limit
            keywords: $keywords
            searchText: $searchText
        ) {
            _id
            name
            acronym
            contactMail
            description
            links {
                label
                value
                description
            }
        }
    }
`;

export default GetApplicationListByPageAndParams;
