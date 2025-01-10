import { gql } from 'graphql-request';

const GetEvolutionHelpStatus = gql`
    query GetEvolutionHelpStatus($where: JSON, $sort: [String]) {
        getEvolutionHelpStatus(where: $where, sort: $sort) {
            label
            value
        }
    }
`;

export default GetEvolutionHelpStatus;
