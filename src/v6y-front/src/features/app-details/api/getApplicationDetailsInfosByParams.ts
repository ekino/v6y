import { gql } from 'graphql-request';

const GetApplicationDetailsInfosByParams = gql`
    query getApplicationDetailsInfoByParams($_id: Int!) {
        getApplicationDetailsInfoByParams(_id: $_id) {
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
