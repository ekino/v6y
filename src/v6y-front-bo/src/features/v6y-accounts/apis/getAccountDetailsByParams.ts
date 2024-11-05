import { gql } from 'graphql-request';

const GetAccountDetailsByParams = gql`
    query GetAccountDetailsByParams($_id: Int!) {
        getAccountDetailsByParams(_id: $_id) {
            _id
            username
            email
            role
        }
    }
`;

export default GetAccountDetailsByParams;
