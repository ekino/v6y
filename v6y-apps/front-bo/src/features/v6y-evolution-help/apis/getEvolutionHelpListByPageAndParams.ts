import { gql } from 'graphql-request';

const GetEvolutionHelpListByPageAndParams = gql`
    query GetEvolutionHelpListByPageAndParams($start: Int, $limit: Int, $sort: String) {
        getEvolutionHelpListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
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

export default GetEvolutionHelpListByPageAndParams;
