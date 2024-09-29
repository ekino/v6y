import { gql } from 'graphql-request';

const GetApplicationList = gql`
    query GetApplicationList($start: Int, $limit: Int, $sort: String) {
        getApplicationListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
            _id
            acronym
            name
            description
        }
    }
`;

export default GetApplicationList;
