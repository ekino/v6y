const ApplicationQueriesType = `
  type Query {
    getApplicationListByPageAndParams(start: Int, offset: Int, limit: Int, keywords: [String], searchText: String, where: JSON, sort: String): [ApplicationType]
    getApplicationStatsByParams(keywords: [String]): [KeywordStatsType]
    getApplicationTotalByParams(keywords: [String], searchText: String): Int
    getApplicationDetailsInfoByParams(appId: String!): ApplicationType
    getApplicationDetailsAuditReportsByParams(appId: String!): [AuditReportType]
    getApplicationDetailsEvolutionsByParams(appId: String!): [EvolutionType]
    getApplicationDetailsDependenciesByParams(appId: String!): [DependencyType]
    getApplicationDetailsKeywordsByParams(appId: String): [KeywordType]
  }
`;

export default ApplicationQueriesType;
