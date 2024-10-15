const AccountDeleteInput = `
    input AccountDeleteInputClause {
        """ Account to delete id """
        id: Int!
    }

    input AccountDeleteInput {
        """ Account to delete id """
        where: AccountDeleteInputClause!
    }
`;

export default AccountDeleteInput;
