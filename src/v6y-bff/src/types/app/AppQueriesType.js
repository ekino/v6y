const AppQueriesType = `
  type Query {
    getAppListByPageAndParams(start: Int, offset: Int, limit: Int, keywords: [String], searchText: String, where: JSON, sort: String): [AppType]
    getAppsStatsByParams(keywords: [String]): [KeywordStatsType]
    getAppsTotalByParams(keywords: [String], searchText: String): Int
    getAppDetailsInfosByParams(appId: String!): AppType
    getAppDetailsAuditReportsByParams(appId: String!): [AuditReportType]
    getAppDetailsEvolutionsByParams(appId: String!): [EvolutionType]
    getAppDetailsDependenciesByParams(appId: String!): [DependencyType]
  }
`;

export default AppQueriesType;
