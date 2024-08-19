const EvolutionModuleType = `
  """ Based on the status of the project and it's conformity to quality gates and recommended update, 
  we can suggest an Evolution. """
  type EvolutionModuleType {
    """ Module Application Unique Id """
    appId: String!
    
    """ Module Application Branch """
    branch: String
    
    """ Module Application Path """
    module: String
  }
`;

export default EvolutionModuleType;
