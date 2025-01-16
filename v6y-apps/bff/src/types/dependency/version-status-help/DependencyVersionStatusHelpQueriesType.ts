const DependencyVersionStatusHelpQueriesType = `
  type Query {
    getDependencyVersionStatusHelpListByPageAndParams(start: Int, limit: Int, where: JSON, sort: String): [DependencyVersionStatusHelpType]
    getDependencyVersionStatusHelpDetailsByParams(_id: Int!): DependencyVersionStatusHelpType
  }
`;

export default DependencyVersionStatusHelpQueriesType;
