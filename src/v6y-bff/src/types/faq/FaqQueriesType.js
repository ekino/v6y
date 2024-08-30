const FaqQueriesType = `
  type Query {
    getFaqsByParams: [FaqType]
    getFaqListByPageAndParams(start: Int, offset: Int, limit: Int, keywords: [String], searchText: String, where: JSON, sort: String): [FaqType]
    getFaqDetailsInfosByParams(faqId: String!): FaqType
  }
`;

export default FaqQueriesType;
