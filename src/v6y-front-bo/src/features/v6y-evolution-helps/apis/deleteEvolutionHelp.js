import { gql } from 'graphql-request';

const DeleteEvolutionHelp = gql`
    mutation DeleteEvolutionHelp($input: EvolutionHelpDeleteInput!) {
        deleteEvolutionHelp(input: $input) {
            id: _id
        }
    }
`;

export default DeleteEvolutionHelp;
