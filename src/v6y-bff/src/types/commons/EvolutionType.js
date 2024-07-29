const EvolutionType = `
  """ Based on the status of the project and it's conformity to quality gates and recommended update, 
  we can suggest an Evolution. """
  type EvolutionType {
    """ Evolution Unique id """
    _id: String!
    
    """ Evolution type (exp: app-5.2, app-5.1, node-sass, ...) """
    title: String!
    
    """ Evolution Branch """
    branch: String
    
    """ Evolution description """
    description: String!
    
    """ Evolution type (frontend/Ops/...) """
    type: String!
    
    """ Evolution documentation links for the suggested evolution """
    docLinks: [LinkType]
  }
`;

export default EvolutionType;
