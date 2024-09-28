const ApplicationDeleteInput = `
  input ApplicationDeleteInputClause {
      """ Application to delete id """
      _id: Int!
  }
  
  input ApplicationDeleteInput {
      """ Application to delete id """
      where: ApplicationDeleteInputClause!
  }
`;

export default ApplicationDeleteInput;
