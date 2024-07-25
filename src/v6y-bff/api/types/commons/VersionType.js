const VersionType = `
  """ Define a semver version of a package or artifact """
  type VersionType {
    """ Version Unique id """
    _id: String!
    
    """ Version value (1.0.2, 2.0.0, 2.0.2-alpha, ...) """
    label: String!
    
    """ Possible values for status : valid, deprecated, outdated """
    status: String!
    
    """ Description attribute can be used for additional informations about the version (security, deprecated, ...) """
    description: String
  }
`;

export default VersionType;
