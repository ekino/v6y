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
                category
                title
                description
                links {
                    label
                    value
                    description
                }
            }
        }
    }
`;

export default GetApplicationDetailsDependenciesByParams;
