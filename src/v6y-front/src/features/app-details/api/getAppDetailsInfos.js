import { gql } from 'graphql-request';

const GetAppDetailsInfos = gql`
    query getAppDetails($appId: String) {
        getAppDetailsInfos: getAppDetailsByParams(appId: $appId) {
            name
            acronym
            mails
            description
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

export default GetAppDetailsInfos;
