import { gql } from 'graphql-request';

const GetDependencyVersionStatusHelpListByPageAndParams = gql`
    query GetDependencyVersionStatusHelpListByPageAndParams(
        $start: Int
        $limit: Int
        $sort: String
    ) {
        getDependencyVersionStatusHelpListByPageAndParams(
            start: $start
            limit: $limit
            sort: $sort
        ) {
            _id
            title
            description
            category
        }
    }
`;

export default GetDependencyVersionStatusHelpListByPageAndParams;
