const AccountDeleteInput = `
    input AccountDeleteInputClause {
        """ Account to delete id """
        id: String!
    }

    input AccountDeleteInput {
        """ Account to delete id """
        where: AccountDeleteInputClause!
    }
`;

export default AccountDeleteInput;
