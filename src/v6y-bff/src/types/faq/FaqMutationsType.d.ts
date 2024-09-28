declare const FaqMutationsType = "\n  type Mutation {\n    createOrEditFaq(faqInput: FaqCreateOrEditInput!): FaqType\n    deleteFaq(input: FaqDeleteInput!): FaqDeleteOutput\n  }\n";
export default FaqMutationsType;
