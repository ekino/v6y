const EvolutionHelpDeleteInput = `
  input EvolutionHelpDeleteInputClause {
      """ Evolution Help to delete id """
      _id: String!
  }
  
  input EvolutionHelpDeleteInput {
      """ Evolution Help to delete id """
      where: EvolutionHelpDeleteInputClause!
  }
`;

export default EvolutionHelpDeleteInput;
