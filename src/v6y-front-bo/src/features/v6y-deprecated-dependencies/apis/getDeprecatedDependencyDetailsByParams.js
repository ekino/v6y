import { gql } from 'graphql-request';

const GetDeprecatedDependencyDetailsByParams = gql`
    query GetDeprecatedDependencyDetailsByParams($deprecatedDependencyId: String!) {
        getDeprecatedDependencyDetailsByParams(deprecatedDependencyId: $deprecatedDependencyId) {
            id: _id
            name
        }
    }
`;

export default GetDeprecatedDependencyDetailsByParams;
