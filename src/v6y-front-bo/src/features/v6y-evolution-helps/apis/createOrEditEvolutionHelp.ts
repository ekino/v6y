import { gql } from 'graphql-request';

const CreateOrEditEvolutionHelp = gql`
    mutation CreateOrEditEvolutionHelp($evolutionHelpInput: EvolutionHelpCreateOrEditInput!) {
        createOrEditEvolutionHelp(evolutionHelpInput: $evolutionHelpInput) {
            _id
        }
    }
`;

export default CreateOrEditEvolutionHelp;
