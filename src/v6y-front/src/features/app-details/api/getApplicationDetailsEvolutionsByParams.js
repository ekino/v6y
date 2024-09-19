import { gql } from 'graphql-request';

const GetApplicationDetailsEvolutionsByParams = gql`
    query getApplicationDetailsEvolutionsByParams($appId: String!) {
        getApplicationDetailsEvolutionsByParams(appId: $appId) {
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
