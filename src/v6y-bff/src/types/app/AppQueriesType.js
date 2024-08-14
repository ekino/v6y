const AppQueriesType = `
  type Query {
    getAppKeywords: [KeywordType]
    getAppListByPageAndParams(offset: Int, limit: Int, keywords: [String], searchText: String): [AppType]
    getAppsTotalByParams(keywords: [String], searchText: String): Int
    getAppDetailsByParams(appId: String): AppType
    getAppDetailsAuditReportsByParams(appId: String): [AuditReportType]
  }
`;

export default AppQueriesType;
