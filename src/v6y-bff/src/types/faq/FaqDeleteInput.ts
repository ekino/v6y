const FaqDeleteInput = `
  input FaqDeleteInputClause {
      """ Faq to delete id """
      id: String!
  }
  
  input FaqDeleteInput {
      """ Faq to delete id """
      where: FaqDeleteInputClause!
  }
`;

export default FaqDeleteInput;
