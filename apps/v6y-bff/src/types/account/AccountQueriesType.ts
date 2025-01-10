const AccountQueriesType = `
    type Query {
        getAccountListByPageAndParams(start: Int, offset: Int, limit: Int, searchText: String, where: JSON, sort: String): [AccountType]
        getAccountDetailsByParams(_id: Int!): AccountType
        loginAccount(input: AccountLoginInput!): AccountLoginOutput
    }
`;

export default AccountQueriesType;
