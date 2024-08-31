const DependencyStatusHelpQueriesType = `
  type Query {
    getDependencyStatusHelpListByPageAndParams(offset: Int, limit: Int, where: JSON, sort: String): [DependencyStatusHelpType]
    getDependencyStatusHelpDetailsByParams(dependencyStatusHelpId: String!): DependencyStatusHelpType
  }
`;

export default DependencyStatusHelpQueriesType;
