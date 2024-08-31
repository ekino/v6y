const DependencyType = `
  """ A dependency can be a npm module, rust crate, java dependency, ... """
  type DependencyType {
    """ Dependency Unique id """
    _id: String!
    
    """ Dependency Type (frontend/backend) """
    type: String
    
    """ Dependency Unique Name (name for node or artifactId for java) """
    name: String
    
    """ Dependency Version """
    version: String
    
    """ Dependency Recommended Version """
    recommendedVersion: String
                            
    """ Dependency status (deprecated, outdated or up-to-date) """
    status: String
    
    """ Dependency Status help """
    statusHelp: DependencyStatusHelpType  
    
    """ Dependency Concerned Module """
    module: ModuleType
  }
`;

export default DependencyType;
