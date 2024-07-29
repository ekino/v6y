
const FaqType = `
  type FaqType {
    """ FAQ Question """
    title: String!
    
    """ FAQ Question Response """
    description: String!
    
    """ FAQ Question Legend Color """
    color: Int!
    
    """ FAQ Extra Help Links """
    links: [LinkType]
  }
`;

export default FaqType;
