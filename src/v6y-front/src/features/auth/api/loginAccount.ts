import { gql } from 'graphql-request';

const LoginAccount = gql`
    query loginAccount {
        loginAccount {
            _id
            role
            token
        }
    }
`;

export default LoginAccount;
