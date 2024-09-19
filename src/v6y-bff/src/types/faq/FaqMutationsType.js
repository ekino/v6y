const FaqMutationsType = `
  type Mutation {
    createOrEditFaq(faqInput: FaqCreateOrEditInput!): FaqType
    deleteFaq(input: FaqDeleteInput!): FaqDeleteOutput
  }
`;

export default FaqMutationsType;
