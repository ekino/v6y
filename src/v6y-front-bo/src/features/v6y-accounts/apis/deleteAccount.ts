import { gql } from 'graphql-request';

const DeleteAccount = gql`
    mutation DeleteAccount($input: AccountDeleteInput!) {
        deleteAccount(input: $input) {
            _id
        }
    }
`;

export default DeleteAccount;

