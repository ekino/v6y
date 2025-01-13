import { gql } from 'graphql-request';

const GetEvolutionHelpDetailsByParams = gql`
    query GetEvolutionHelpDetailsByParams($_id: Int!) {
        getEvolutionHelpDetailsByParams(_id: $_id) {
            _id
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
