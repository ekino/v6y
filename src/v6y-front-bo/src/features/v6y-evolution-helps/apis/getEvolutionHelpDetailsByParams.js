import { gql } from 'graphql-request';

const GetEvolutionHelpDetailsByParams = gql`
    query GetEvolutionHelpDetailsByParams($evolutionHelpId: String!) {
        getEvolutionHelpDetailsByParams(evolutionHelpId: $evolutionHelpId) {
            id: _id
            title
            description
            category
            status
            links {
                label
                value
                description
            }
        }
    }
`;

export default GetEvolutionHelpDetailsByParams;
