import { gql } from 'graphql-request';

const CreateOrEditEvolutionHelp = gql`
    mutation CreateOrEditEvolutionHelp($evolutionHelpInput: EvolutionHelpCreateOrEditInput!) {
        createOrEditEvolutionHelp(evolutionHelpInput: $evolutionHelpInput) {
            id: _id
        }
    }
`;

export default CreateOrEditEvolutionHelp;
