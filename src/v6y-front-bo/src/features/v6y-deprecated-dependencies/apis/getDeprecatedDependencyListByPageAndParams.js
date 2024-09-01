import { gql } from 'graphql-request';

const GetDeprecatedDependencyListByPageAndParams = gql`
    query GetDeprecatedDependencyListByPageAndParams($start: Int, $limit: Int, $sort: String) {
        getDeprecatedDependencyListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
            id: _id
            name
        }
    }
`;

export default GetDeprecatedDependencyListByPageAndParams;
