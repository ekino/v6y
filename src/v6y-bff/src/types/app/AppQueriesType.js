const AppQueriesType = `
  type Query {
    getAppListByPageAndParams(offset: Int, limit: Int, keywords: [String], searchText: String): [AppType]
    getAppsStatsByParams(keywords: [String]): [KeywordStatsType]
    getAppsTotalByParams(keywords: [String], searchText: String): Int
    getAppDetailsByParams(appId: String): AppType
    getAppDetailsAuditReportsByParams(appId: String): [AuditReportType]
  }
`;

export default AppQueriesType;
