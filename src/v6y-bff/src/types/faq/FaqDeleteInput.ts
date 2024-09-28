const FaqDeleteInput = `
  input FaqDeleteInputClause {
      """ Faq to delete id """
      _id: Int!
  }
  
  input FaqDeleteInput {
      """ Faq to delete id """
      where: FaqDeleteInputClause!
  }
`;

export default FaqDeleteInput;
