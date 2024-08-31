import { gql } from 'graphql-request';

const GetFaqListByPageAndParams = gql`
    query GetFaqListByPageAndParams($start: Int, $limit: Int, $sort: String) {
        getFaqListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
            id: _id
            title
            description
            links {
                label
                value
                description
            }
        }
    }
`;

export default GetFaqListByPageAndParams;
