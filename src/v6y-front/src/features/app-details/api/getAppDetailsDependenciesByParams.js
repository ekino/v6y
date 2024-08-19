import { gql } from 'graphql-request';

const GetAppDetailsDependenciesByParams = gql`
    query getAppDetailsDependenciesByParams($appId: String) {
        getAppDetailsDependenciesByParams(appId: $appId) {
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

export default GetAppDetailsDependenciesByParams;
