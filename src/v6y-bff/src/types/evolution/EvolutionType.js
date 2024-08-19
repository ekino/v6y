const EvolutionType = `
  """ Based on the status of the project and it's conformity to quality gates and recommended update, 
  we can suggest an Evolution. """
  type EvolutionType {
    """ Evolution Unique id """
    _id: String!
    
    """ Evolution type (exp: app-5.2, app-5.1, node-sass, ...) """
    title: String!
    
    """ Evolution description """
    description: String!
    
    """ Possible values for status : critical, important, recommended """
    status: String
    
    """ Evolution documentation links for the suggested evolution """
    links: [LinkType]
    
    """ Application Suggested Evolution Modules """
    modules: [EvolutionModuleType]
  }
`;

export default EvolutionType;
