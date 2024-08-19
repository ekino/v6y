const DependencyHelpType = `
  """ Dependency Recommended help """
  type DependencyHelpType {
    """ Dependency Status Help Title """
    title: String
    
    """ Dependency Status Label """
    status: String
    
    """ Dependency Status Help Description """
    description: String
    
    """ Dependency Status Help links """
    links: [LinkType]
  }
`;

export default DependencyHelpType;
