declare const DependencyStatusHelpQueriesType = "\n  type Query {\n    getDependencyStatusHelpListByPageAndParams(start: Int, limit: Int, where: JSON, sort: String): [DependencyStatusHelpType]\n    getDependencyStatusHelpDetailsByParams(_id: Int!): DependencyStatusHelpType\n  }\n";
export default DependencyStatusHelpQueriesType;
