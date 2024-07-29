const DependencyType = `
  """ A dependency can be a npm module or a java dependency """
  type DependencyType {
    """ Dependency Unique id """
    _id: String!
    
    """ Dependency Type (frontend/backend) """
    type: String
    
    """ Dependency Unique Name (name for node or artifactId for java) """
    name: String
    
    """ Dependency Branch """
    branch: String
    
    """ Dependency Group (Especially used for java module) """
    groupId: String
    
    """ Dependency Version """
    version: String
    
    """ Dependency Major Version """
    major: String

    """ Dependency Minor Version """
    minor: String
    
    """ Dependency Patch Version """
    patch: String
               
    """ Dependency status (deprecated, conflict, old or up-to-date) """
    status: String
    
    """ Dependency packaging (jar, war, ...) """
    packaging: String
    
    """ Dependency scope (Especially used for java module) """
    scope: String
    
    """ Dependency Recommended help """
    help: HelpType  
    
    """ Dependency Used On Path """
    usedOnPath: String
    
    """ Dependency Used On Url """
    usedOnUrl: String

    """ Dependency Recommended Version """
    recommendedVersion: String
  }
`;

export default DependencyType;
