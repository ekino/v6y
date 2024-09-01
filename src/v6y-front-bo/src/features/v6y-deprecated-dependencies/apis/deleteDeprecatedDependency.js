import { gql } from 'graphql-request';

const DeleteDeprecatedDependency = gql`
    mutation DeleteDeprecatedDependency($input: DeprecatedDependencyDeleteInput!) {
        deleteDeprecatedDependency(input: $input) {
            id: _id
        }
    }
`;

export default DeleteDeprecatedDependency;
