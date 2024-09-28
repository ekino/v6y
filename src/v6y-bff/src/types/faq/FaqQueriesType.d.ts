declare const FaqQueriesType = "\n  type Query {\n    getFaqListByPageAndParams(start: Int, limit: Int, sort: String): [FaqType]\n    getFaqDetailsByParams(_id: Int!): FaqType\n  }\n";
export default FaqQueriesType;
