const AccountMutationsType = `
    type Mutation {
    createOrEditAccount(input: AccountCreateOrEditInput!): AccountCreateOrEditOutput
    updateAccountPassword(input: AccountUpdatePasswordInput!): AccountUpdatePasswordOutput
    deleteAccount(input: AccountDeleteInput!): AccountDeleteOutput
    }
`;

export default AccountMutationsType;
