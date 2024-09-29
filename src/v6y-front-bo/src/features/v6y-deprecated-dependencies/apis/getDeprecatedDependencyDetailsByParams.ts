import { gql } from 'graphql-request';

const GetDeprecatedDependencyDetailsByParams = gql`
    query GetDeprecatedDependencyDetailsByParams($_id: Int!) {
        getDeprecatedDependencyDetailsByParams(_id: $_id) {
            _id
            name
        }
    }
`;

export default GetDeprecatedDependencyDetailsByParams;
