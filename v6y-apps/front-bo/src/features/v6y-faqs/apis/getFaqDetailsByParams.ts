import { gql } from 'graphql-request';

const GetFaqDetailsByParams = gql`
    query GetFaqDetailsByParams($_id: Int!) {
        getFaqDetailsByParams(_id: $_id) {
            _id
            title
            description
            links {
                label
                value
                description
            }
        }
    }
`;

export default GetFaqDetailsByParams;
