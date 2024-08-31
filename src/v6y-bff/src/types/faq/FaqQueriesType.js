const FaqQueriesType = `
  type Query {
    getFaqListByPageAndParams(start: Int, offset: Int, limit: Int, keywords: [String], searchText: String, where: JSON, sort: String): [FaqType]
    getFaqDetailsByParams(faqId: String!): FaqType
  }
`;

export default FaqQueriesType;
