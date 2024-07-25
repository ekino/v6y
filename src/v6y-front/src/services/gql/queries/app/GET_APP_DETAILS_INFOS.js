import { gql } from 'graphql-request';

const GET_APP_DETAILS_INFOS = gql`
    query getAppDetails($appId: String) {
        getAppDetailsInfos: getAppDetails(appId: $appId) {
            name
            links {
                type
                label
                value
                description
            }
            repo {
                name
                owner
                fullName
                webUrl
                gitUrl
                allBranches
            }
        }
    }
`;

export default GET_APP_DETAILS_INFOS;
