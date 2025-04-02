import { gql } from 'graphql-request';

const GetApplicationDetails = gql`
    query GetApplicationDetails($_id: Int!) {
        getApplicationDetailsInfoByParams(_id: $_id) {
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
                organization
                webUrl
                gitUrl
            }
            configuration {
                dataDog {
                    apiKey
                    appKey
                    monitorId
                    url
                }
            }
        }
    }
`;

export default GetApplicationDetails;
