import { gql } from 'graphql-request';

const CreateOrEditAccount = gql`
    mutation CreateOrEditAccount($accountInput: AccountCreateOrEditInput!) {
        createOrEditAccount(input: $accountInput) {
            _id
        }
    }
`;

export default CreateOrEditAccount;
