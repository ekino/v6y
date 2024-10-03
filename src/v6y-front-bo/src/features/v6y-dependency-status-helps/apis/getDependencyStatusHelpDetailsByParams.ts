import { gql } from 'graphql-request';

const GetDependencyStatusHelpDetailsByParams = gql`
    query GetDependencyStatusHelpDetailsByParams($_id: Int!) {
        getDependencyStatusHelpDetailsByParams(_id: $_id) {
            _id
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
