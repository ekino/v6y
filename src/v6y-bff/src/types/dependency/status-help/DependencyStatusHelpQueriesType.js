const DependencyStatusHelpQueriesType = `
  type Query {
    getDependencyStatusHelpListByPageAndParams(start: Int, limit: Int, where: JSON, sort: String): [DependencyStatusHelpType]
    getDependencyStatusHelpDetailsByParams(dependencyStatusHelpId: String!): DependencyStatusHelpType
  }
`;

export default DependencyStatusHelpQueriesType;
