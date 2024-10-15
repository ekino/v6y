const AccountMutationsType = `
    type Mutation {
    createOrEditAccount(accountInput: AccountCreateOrEditInput!): AccountCreateOrEditOutput
    deleteAccount(input: AccountDeleteInput!): AccountDeleteOutput
    }
`;

export default AccountMutationsType;
