import { gql } from 'graphql-request';

const GetApplicationDetailsByParams = gql`
    query getApplicationDetailsByParams($appId: String!) {
        getApplicationDetailsByParams(appId: $appId) {
            _id
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
                module {
                    branch
                    path
                    url
                }
            }
        }
    }
`;

export default GetApplicationDetailsByParams;
