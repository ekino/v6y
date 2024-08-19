import { gql } from 'graphql-request';

const GetAppDetailsEvolutionsByParams = gql`
    query getAppDetailsEvolutionsByParams($appId: String) {
        getAppDetailsEvolutionsByParams(appId: $appId) {
            _id
            title
            description
            status
            links {
                label
                description
                value
            }
            modules {
                branch
                module
            }
        }
    }
`;

export default GetAppDetailsEvolutionsByParams;
