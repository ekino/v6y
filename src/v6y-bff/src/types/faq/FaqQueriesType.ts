const FaqQueriesType = `
  type Query {
    getFaqListByPageAndParams(start: Int, limit: Int, sort: String): [FaqType]
    getFaqDetailsByParams(_id: Int!): FaqType
  }
`;

export default FaqQueriesType;
