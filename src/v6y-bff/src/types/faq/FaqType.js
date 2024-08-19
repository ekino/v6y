const FaqType = `
  type FaqType {
    """ FAQ Unique id """
    _id: String!
    
    """ FAQ Question """
    title: String!
    
    """ FAQ Question Response """
    description: String!
    
    """ FAQ Question Legend Color """
    color: Int!
    
    """ FAQ Extra Links """
    links: [LinkType]
  }
`;

export default FaqType;
