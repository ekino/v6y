const AccountUpdatePasswordInput = `
    input AccountUpdatePasswordInput {
        """ Account Id """
        _id: Int!
        
        """ Account New Password """
        password : String!
    }
`;

export default AccountUpdatePasswordInput;
