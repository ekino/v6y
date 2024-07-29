const LinkType = `
  type LinkType {
    """ Link Unique id """
    _id: String!
    
    """ Link type (exp: gitlab, github, help, doc, others) """
    type: String
    
    """ Link label """
    label: String
    
    """ Link value """
    value: String
    
    """ Link description """
    description: String
  }
`;

export default LinkType;
