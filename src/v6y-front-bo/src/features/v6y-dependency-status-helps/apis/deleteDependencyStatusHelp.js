import { gql } from 'graphql-request';

const DeleteDependencyStatusHelp = gql`
    mutation DeleteDependencyStatusHelp($input: DependencyStatusHelpDeleteInput!) {
        deleteDependencyStatusHelp(input: $input) {
            id: _id
        }
    }
`;

export default DeleteDependencyStatusHelp;
