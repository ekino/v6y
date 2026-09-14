const AccountMutationsType = `
    type Mutation {
    createOrEditAccount(input: AccountCreateOrEditInput!): AccountCreateOrEditOutput
    updateAccountPassword(input: AccountUpdatePasswordInput!): AccountUpdatePasswordOutput
    updateAccountNotificationSettings(input: AccountNotificationSettingsInput!): AccountNotificationSettingsType
    deleteAccount(input: AccountDeleteInput!): AccountDeleteOutput
    }
`;

export default AccountMutationsType;
