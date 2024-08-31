import { gql } from 'graphql-request';

const GetApplicationDetailsDependenciesByParams = gql`
    query getApplicationDetailsDependenciesByParams($appId: String!) {
        getApplicationDetailsDependenciesByParams(appId: $appId) {
            _id
            type
            name
            version
            recommendedVersion
            status
            statusHelp {
                title
                category
                description
                links {
                    label
                    value
                    description
                }
            }
            module {
                branch
                path
                url
            }
        }
    }
`;

export default GetApplicationDetailsDependenciesByParams;
