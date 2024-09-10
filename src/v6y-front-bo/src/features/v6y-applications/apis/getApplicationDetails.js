import { gql } from 'graphql-request';

const GetApplicationDetails = gql`
    query GetApplicationDetails($appId: String!) {
        getApplicationDetailsByParams(appId: $appId) {
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
                organization
                webUrl
                gitUrl
                allBranches
            }
        }
    }
`;

export default GetApplicationDetails;
