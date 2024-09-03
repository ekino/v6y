const FaqQueriesType = `
  type Query {
    getFaqListByPageAndParams(start: Int, limit: Int, sort: String): [FaqType]
    getFaqDetailsByParams(faqId: String!): FaqType
  }
`;

export default FaqQueriesType;
