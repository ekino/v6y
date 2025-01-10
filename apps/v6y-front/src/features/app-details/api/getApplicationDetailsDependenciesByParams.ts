import { gql } from 'graphql-request';

const GetApplicationDetailsDependenciesByParams = gql`
    query getApplicationDetailsDependenciesByParams($_id: Int!) {
        getApplicationDetailsDependenciesByParams(_id: $_id) {
            _id
            type
            name
            version
            recommendedVersion
            status
            statusHelp {
                _id
                category
                title
                description
                links {
                    label
                    value
                    description
                }
            }
            module {
                appId
                branch
                path
                url
                status
                version
            }
        }
    }
`;

export default GetApplicationDetailsDependenciesByParams;
