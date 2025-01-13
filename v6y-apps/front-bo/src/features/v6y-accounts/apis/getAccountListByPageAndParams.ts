import { gql } from 'graphql-request';

const GetAccountListByPageAndParams = gql`
    query GetAccountListByPageAndParams {
        getAccountListByPageAndParams {
            _id
            username
            email
            role
        }
    }
`;

export default GetAccountListByPageAndParams;
