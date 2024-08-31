import { gql } from 'graphql-request';

const GetApplicationDetailsEvolutionsByParams = gql`
    query getApplicationDetailsEvolutionsByParams($appId: String!) {
        getApplicationDetailsEvolutionsByParams(appId: $appId) {
            _id
            type
            category
            subCategory
            module {
                branch
                path
                url
            }
            evolutionHelp {
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
