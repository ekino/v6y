import { gql } from 'graphql-request';

const GetApplicationDetails = gql`
    query GetApplicationDetails($appId: String!) {
        getAppDetailsInfosByParams(appId: $appId) {
            id: _id
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
        }
    }
`;

export default GetApplicationDetails;
