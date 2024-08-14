import { gql } from 'graphql-request';

const GetAppDetailsDependencies = gql`
    query getAppDetails($appId: String) {
        getAppDetailsDependencies: getAppDetailsByParams(appId: $appId) {
            dependencies {
                type
                name
                branch
                groupId
                packaging
                status
                scope
                version
                usedOnPath
                usedOnUrl
                recommendedVersion
                help {
                    title
                    description
                    extras
                    docLinks {
                        type
                        label
                        description
                        value
                    }
                }
            }
        }
    }
`;

export default GetAppDetailsDependencies;
