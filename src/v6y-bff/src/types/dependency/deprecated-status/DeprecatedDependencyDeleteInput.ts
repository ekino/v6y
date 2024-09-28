const DeprecatedDependencyDeleteInput = `
  input DeprecatedDependencyDeleteInputClause {
      """ Deprecated Dependency to delete id """
      _id: Int!
  }
  
  input DeprecatedDependencyDeleteInput {
      """ Deprecated Dependency to delete id """
      where: DeprecatedDependencyDeleteInputClause!
  }
`;

export default DeprecatedDependencyDeleteInput;
