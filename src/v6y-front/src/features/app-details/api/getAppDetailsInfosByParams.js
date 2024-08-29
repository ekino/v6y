import { gql } from 'graphql-request';

const GetAppDetailsInfosByParams = gql`
    query getAppDetailsInfosByParams($appId: String) {
        getAppDetailsInfosByParams(appId: $appId) {
            name
            acronym
            contactMail
            description
            links {
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
            keywords {
                label
                version
                status
                helpMessage
            }
        }
    }
`;

export default GetAppDetailsInfosByParams;
