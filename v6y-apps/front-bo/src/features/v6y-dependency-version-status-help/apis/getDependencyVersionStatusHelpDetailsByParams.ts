import { gql } from 'graphql-request';

const GetDependencyVersionStatusHelpDetailsByParams = gql`
    query GetDependencyVersionStatusHelpDetailsByParams($_id: Int!) {
        getDependencyVersionStatusHelpDetailsByParams(_id: $_id) {
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

export default GetDependencyVersionStatusHelpDetailsByParams;
