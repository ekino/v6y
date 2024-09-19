const DeprecatedDependencyQueriesType = `
  type Query {
    getDeprecatedDependencyListByPageAndParams(start: Int, offset: Int, limit: Int, keywords: [String], searchText: String, where: JSON, sort: String): [DeprecatedDependencyType]
    getDeprecatedDependencyDetailsByParams(deprecatedDependencyId: String!): DeprecatedDependencyType
  }
`;

export default DeprecatedDependencyQueriesType;
