const HelpType = `
  type HelpType {
    """ Help Unique id """
    _id: String!
    
    """ Help title """
    title: String!
    
    """ Help description """
    description: String!
    
    """ Help more details """
    extras: String
    
    """ Help documentation links for the suggested help """
    docLinks: [LinkType]
  }
`;

export default HelpType;
