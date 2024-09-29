import { gql } from 'graphql-request';

const GetApplicationDetailsInfosByParams = gql`
    query getApplicationDetailsInfoByParams($appId: String!) {
        getApplicationDetailsInfoByParams(appId: $appId) {
            _id
            name
            acronym
            contactMail
            description
            repo {
                name
                webUrl
                gitUrl
                allBranches
            }
            links {
                label
                value
                description
            }
        }
    }
`;

export default GetApplicationDetailsInfosByParams;
