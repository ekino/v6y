const AccountQueriesType = `
    type Query {
        getAccountListByPageAndParams(start: Int, offset: Int, limit: Int, searchText: String, where: JSON, sort: String): [AccountType]
        getAccountDetailsByParams(_id: Int!): AccountType
    }
`;

export default AccountQueriesType;
