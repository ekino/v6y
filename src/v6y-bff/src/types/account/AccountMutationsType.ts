const AccountMutationsType = `
    type Mutation {
    createOrEditAccount(accountInput: AccountCreateOrEditInput!): AccountType
    deleteAccount(input: AccountDeleteInput!): AccountDeleteOutput
    }
`;

export default AccountMutationsType;
