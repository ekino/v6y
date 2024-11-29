const AccountCreateOrEditInput = `
    input AccountCreateOrEditInput {
        """ Account Unique id """
        _id: Int

        """ Account Email """
        email: String!

        """ Account Username """
        username: String!

        """ Account Password """
        password: String!

        """ Account Role """
        role: String!

        """ Applications """
        applications: [Int]
    }
`;

export default AccountCreateOrEditInput;
