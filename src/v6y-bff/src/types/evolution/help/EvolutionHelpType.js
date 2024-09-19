const EvolutionHelpType = `
  """ Based on the status of the project and it's conformity to quality gates and recommended update, 
  we can suggest an Evolution. """
  type EvolutionHelpType {
    """ Evolution Help Unique id """
    _id: String!
    
    """ Evolution Help Title (exp: app-5.2, app-5.1, node-sass, ...) """
    title: String!
    
    """ Evolution Help Description """
    description: String!
    
    """ Evolution Help Category """
    category: String! 
    
    """ Evolution Help status (possible values for status : critical, important, recommended) """
    status: String!
    
    """ Evolution Help documentation links for the suggested evolution """
    links: [LinkType]
  }
`;

export default EvolutionHelpType;
