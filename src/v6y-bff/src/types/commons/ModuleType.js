const ModuleType = `
  """ Analyzed Module Main Information """
  type ModuleType {
    """ Module Application Unique Id """
    appId: String!
    
    """ Module Application Branch """
    branch: String
    
    """ Module Application Path """
    path: String
    
    """ Module Application Url """
    url: String
    
    """ Module Status """
    status: String
    
    """ Module Version """
    version: String
  }
`;

export default ModuleType;
