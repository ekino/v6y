import { gql } from 'graphql-request';

const GET_APP_DETAILS_DEPENDENCIES = gql`
    query getAppDetails($appId: String) {
        getAppDetailsDependencies: getAppDetails(appId: $appId) {
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

export default GET_APP_DETAILS_DEPENDENCIES;
