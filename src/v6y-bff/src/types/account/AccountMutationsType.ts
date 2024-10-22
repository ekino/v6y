const AccountMutationsType = `
    type Mutation {
    createOrEditAccount(accountInput: AccountCreateOrEditInput!): AccountCreateOrEditOutput
    updateAccountPassword(input: AccountUpdatePasswordInput!): AccountUpdatePasswordOutput
    deleteAccount(input: AccountDeleteInput!): AccountDeleteOutput
    }
`;

export default AccountMutationsType;
