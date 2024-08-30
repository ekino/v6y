const FaqCreateOrEditInput = `
  input FaqCreateOrEditInput {
    """ Faq Unique id """
    faqId: String
      
    """ FAQ Question """
    title: String!
    
    """ FAQ Question Response """
    description: String!
    
    """ FAQ Extra Links """
    links: [String]
  }
`;

export default FaqCreateOrEditInput;
