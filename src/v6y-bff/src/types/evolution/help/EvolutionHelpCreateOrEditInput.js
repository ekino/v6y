const EvolutionHelpCreateOrEditInput = `
  input EvolutionHelpCreateOrEditInput {
    """ EvolutionHelp Unique id """
    evolutionHelpId: String
      
    """ Evolution Help Title """
    title: String!
    
    """ Evolution Help Description """
    description: String!
    
    """ Evolution Help Category """
    category: String! 
    
    """ Evolution Help status """
    status: String!
    
    """ Evolution Help Extra Links """
    links: [String]
  }
`;

export default EvolutionHelpCreateOrEditInput;
