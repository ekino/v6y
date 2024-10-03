const DependencyStatusHelpCreateOrEditInput = `
  input DependencyStatusHelpCreateOrEditInput {
    """ Dependency StatusHelp Unique id """
    _id: Int!
      
    """ Dependency Status Help Title """
    title: String!
    
    """ Dependency Status Help Description """
    description: String!
    
    """ Dependency Status Help Category """
    category: String! 
    
    """ Dependency Status Help Extra Links """
    links: [String]
  }
`;

export default DependencyStatusHelpCreateOrEditInput;
