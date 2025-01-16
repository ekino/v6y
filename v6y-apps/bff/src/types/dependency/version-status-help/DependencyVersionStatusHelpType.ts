const DependencyVersionStatusHelpType = `
  """ Dependency Recommended help """
  type DependencyVersionStatusHelpType {
    """ Dependency Version Status Help Unique id """
    _id: Int!
    
    """ Dependency Version Status Help Title """
    title: String!
    
    """ Dependency Help Category """
    category: String! 
    
    """ Dependency Version Status Help Description """
    description: String
    
    """ Dependency Version Status Help links """
    links: [LinkType]
  }
`;

export default DependencyVersionStatusHelpType;
