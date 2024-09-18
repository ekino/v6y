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
                _id
                category
                title
                description
                links {
                    label
                    value
                    description
                }
            }
            module {
                appId
                branch
                path
                url
                status
                version
            }
        }
    }
`;

export default GetApplicationDetailsDependenciesByParams;
