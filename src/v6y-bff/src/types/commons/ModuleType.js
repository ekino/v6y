const ModuleType = `
  """ Analyzed Module Main Information """
  type ModuleType {
    """ Module Application Unique Id """
    appId: String!
    
    """ Module Application Branch """
    branch: String
    
    """ Module Application Path """
    path: String
    
    """ Module Url """
    url: String
  }
`;

export default ModuleType;
