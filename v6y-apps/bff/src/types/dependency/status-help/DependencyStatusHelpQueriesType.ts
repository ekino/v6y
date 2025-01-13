const DependencyStatusHelpQueriesType = `
  type Query {
    getDependencyStatusHelpListByPageAndParams(start: Int, limit: Int, where: JSON, sort: String): [DependencyStatusHelpType]
    getDependencyStatusHelpDetailsByParams(_id: Int!): DependencyStatusHelpType
  }
`;

export default DependencyStatusHelpQueriesType;
