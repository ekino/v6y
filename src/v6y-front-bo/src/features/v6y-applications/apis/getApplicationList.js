import { gql } from 'graphql-request';

const GetApplicationList = gql`
    query GetApplicationList($start: Int, $limit: Int, $sort: String) {
        getAppListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
            id: _id
            acronym
            name
            description
        }
    }
`;

export default GetApplicationList;
