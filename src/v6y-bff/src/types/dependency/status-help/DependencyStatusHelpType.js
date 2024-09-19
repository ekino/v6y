const DependencyStatusHelpType = `
  """ Dependency Recommended help """
  type DependencyStatusHelpType {
    """ Dependency Status Help Unique id """
    _id: String!
    
    """ Dependency Status Help Title """
    title: String!
    
    """ Dependency Help Category """
    category: String! 
    
    """ Dependency Status Help Description """
    description: String
    
    """ Dependency Status Help links """
    links: [LinkType]
  }
`;

export default DependencyStatusHelpType;
