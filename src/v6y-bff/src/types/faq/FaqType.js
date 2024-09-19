const FaqType = `
  type FaqType {
    """ FAQ Unique id """
    _id: String!
    
    """ FAQ Question """
    title: String!
    
    """ FAQ Question Response """
    description: String!
    
    """ FAQ Extra Links """
    links: [LinkType]
  }
`;

export default FaqType;
