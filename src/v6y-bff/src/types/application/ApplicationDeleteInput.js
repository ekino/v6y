const ApplicationDeleteInput = `
  input ApplicationDeleteInputClause {
      """ Application to delete id """
      id: String!
  }
  
  input ApplicationDeleteInput {
      """ Application to delete id """
      where: ApplicationDeleteInputClause!
  }
`;

export default ApplicationDeleteInput;
