const DependencyVersionStatusHelpDeleteInput = `
  input DependencyVersionStatusHelpDeleteInputClause {
      """ DependencyVersionStatus Help to delete id """
      _id: String!
  }
  
  input DependencyVersionStatusHelpDeleteInput {
      """ DependencyVersionStatus Help to delete id """
      where: DependencyVersionStatusHelpDeleteInputClause!
  }
`;

export default DependencyVersionStatusHelpDeleteInput;
