const AccountType = `
    type AccountType {
        """ Account Unique id """
        _id: Int

        """ Account Username """
        username: String

        """ Account Email """
        email: String

        """ Account Password """
        password: String

        """ Account Role """
        role: String

        """ Applications """
        applications: [Int]
    }
`;
export default AccountType;
