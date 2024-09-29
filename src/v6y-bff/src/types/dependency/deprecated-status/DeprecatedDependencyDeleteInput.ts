const DeprecatedDependencyDeleteInput = `
  input DeprecatedDependencyDeleteInputClause {
      """ Deprecated Dependency to delete id """
      _id: String!
  }
  
  input DeprecatedDependencyDeleteInput {
      """ Deprecated Dependency to delete id """
      where: DeprecatedDependencyDeleteInputClause!
  }
`;

export default DeprecatedDependencyDeleteInput;
