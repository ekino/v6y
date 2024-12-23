import { gql } from 'graphql-request';

const LoginAccount = gql`
    query LoginAccount($input: AccountLoginInput!) {
        loginAccount(input: $input) {
            _id
            role
            token
        }
    }
`;

export default LoginAccount;
