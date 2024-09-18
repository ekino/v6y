const EvolutionType = `
  """ Based on the status of the project and it's conformity to quality gates and recommended update, 
  we can suggest an Evolution. """
  type EvolutionType {
    """ Evolution Unique id """
    _id: String!

    """ Evolution Related App Id """
    appId: String!
    
    """ Evolution category (exp: lighthouse, dependency, code complexity, code security, performance, accessibility, ...) """
    category: String!
    
    """ Evolution help """
    evolutionHelp: EvolutionHelpType
    
    """ Evolution Concerned Module """
    module: ModuleType
  }
`;

export default EvolutionType;
