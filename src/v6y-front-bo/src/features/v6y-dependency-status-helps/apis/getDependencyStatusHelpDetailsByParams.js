import { gql } from 'graphql-request';

const GetDependencyStatusHelpDetailsByParams = gql`
    query GetDependencyStatusHelpDetailsByParams($dependencyStatusHelpId: String!) {
        getDependencyStatusHelpDetailsByParams(dependencyStatusHelpId: $dependencyStatusHelpId) {
            id: _id
            title
            category
            description
            links {
                label
                value
                description
            }
        }
    }
`;

export default GetDependencyStatusHelpDetailsByParams;
