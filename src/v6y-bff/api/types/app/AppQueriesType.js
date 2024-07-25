const AppQueriesType = `
  type Query {
    getAppKeywords: [KeywordType]
    getAppListByPageAndParams(offset: Int, limit: Int, keywords: [String], searchText: String): [AppType]
    getAppTotalNumber(keywords: [String], searchText: String): Int
  }
`;

export default AppQueriesType;
