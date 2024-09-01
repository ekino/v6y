import { gql } from 'graphql-request';

const GetDependencyStatusHelpListByPageAndParams = gql`
    query GetDependencyStatusHelpListByPageAndParams($start: Int, $limit: Int, $sort: String) {
        getDependencyStatusHelpListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
            id: _id
            title
            description
            category
        }
    }
`;

export default GetDependencyStatusHelpListByPageAndParams;
