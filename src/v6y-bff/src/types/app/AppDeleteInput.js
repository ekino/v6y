const AppDeleteInput = `
  input AppDeleteInputClause {
      """ Application to delete id """
      id: String!
  }
  
  input AppDeleteInput {
      """ Application to delete id """
      where: AppDeleteInputClause!
  }
`;

export default AppDeleteInput;
