import { gql } from 'graphql-request';

const DeleteDeprecatedDependency = gql`
    mutation DeleteDeprecatedDependency($input: DeprecatedDependencyDeleteInput!) {
        deleteDeprecatedDependency(input: $input) {
            _id
        }
    }
`;

export default DeleteDeprecatedDependency;
