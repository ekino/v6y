const AccountCreateOrEditInput = `
    input AccountCreateOrEditInput {
        """ Account Unique id """
        _id: Int

        """ Account Email """
        email: String!

        """ Account Username """
        username: String!

        """ Account Password """
        password: String

        """ Account Role """
        role: String!

        """ Applications """
        applications: [Int]

        """ Slack Member ID (U01XXXXXX) for DM notifications """
        slackUserId: String
    }
`;

export default AccountCreateOrEditInput;
