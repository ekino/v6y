const AccountLoginOutput = `
    type AccountLoginOutput {
        """ Account id """
        _id: Int!
        """ Account token """
        token: String!
        """ Account role """
        role: String!
    }
`;

export default AccountLoginOutput;
