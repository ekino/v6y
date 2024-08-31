const DependencyStatusHelpDeleteInput = `
  input DependencyStatusHelpDeleteInputClause {
      """ DependencyStatus Help to delete id """
      id: String!
  }
  
  input DependencyStatusHelpDeleteInput {
      """ DependencyStatus Help to delete id """
      where: DependencyStatusHelpDeleteInputClause!
  }
`;

export default DependencyStatusHelpDeleteInput;
