const DependencyVersionStatusHelpCreateOrEditInput = `
  input DependencyVersionStatusHelpCreateOrEditInput {
    """ Dependency Version Status Help Unique id """
    _id: Int!
      
    """ Dependency Version Status Help Title """
    title: String!
    
    """ Dependency Version Status Help Description """
    description: String!
    
    """ Dependency Version Status Help Category """
    category: String! 
    
    """ Dependency Version Status Help Extra Links """
    links: [String]
  }
`;

export default DependencyVersionStatusHelpCreateOrEditInput;
