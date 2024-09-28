declare const DeprecatedDependencyQueriesType = "\n  type Query {\n    getDeprecatedDependencyListByPageAndParams(start: Int, offset: Int, limit: Int, keywords: [String], searchText: String, where: JSON, sort: String): [DeprecatedDependencyType]\n    getDeprecatedDependencyDetailsByParams(_id: Int!): DeprecatedDependencyType\n  }\n";
export default DeprecatedDependencyQueriesType;
