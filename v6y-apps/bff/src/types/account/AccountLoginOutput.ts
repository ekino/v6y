const AccountLoginOutput = `
    type AccountLoginOutput {
        """ Account id """
        _id: Int!
        """ Account token """
        token: String!
        """ Account role """
        role: String!
        """ Account username"""
        username: String
    }
`;

export default AccountLoginOutput;
