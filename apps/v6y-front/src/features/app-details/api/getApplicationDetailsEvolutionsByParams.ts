import { gql } from 'graphql-request';

const GetApplicationDetailsEvolutionsByParams = gql`
    query getApplicationDetailsEvolutionsByParams($_id: Int!) {
        getApplicationDetailsEvolutionsByParams(_id: $_id) {
            _id
            category
            module {
                branch
                path
                url
            }
            evolutionHelp {
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
    }
`;

export default GetApplicationDetailsEvolutionsByParams;
