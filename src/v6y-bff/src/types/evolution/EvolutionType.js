const EvolutionType = `
  """ Based on the status of the project and it's conformity to quality gates and recommended update, 
  we can suggest an Evolution. """
  type EvolutionType {
    """ Evolution Unique id """
    _id: String!
    
    """ Evolution type (exp: lighthouse, dependency, code complexity, code security, ...) """
    type: String!
    
    """ Evolution category (exp: performance, accessibility, ...) """
    category: String!
    
    """ Evolution subCategory (exp: mobile, 3G, 4G, ...) """
    subCategory: String
    
    """ Evolution help """
    evolutionHelp: EvolutionHelpType
    
    """ Evolution Concerned Module """
    module: ModuleType
  }
`;

export default EvolutionType;
