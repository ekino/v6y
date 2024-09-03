const ApplicationQueriesType = `
  type Query {
    getApplicationListByPageAndParams(start: Int, offset: Int, limit: Int, keywords: [String], searchText: String, where: JSON, sort: String): [ApplicationType]
    getApplicationStatsByParams(keywords: [String]): [KeywordStatsType]
    getApplicationTotalByParams(keywords: [String], searchText: String): Int
    getApplicationDetailsByParams(appId: String!): ApplicationType
    getApplicationDetailsAuditReportsByParams(appId: String!): [AuditReportType]
    getApplicationDetailsEvolutionsByParams(appId: String!): [EvolutionType]
    getApplicationDetailsDependenciesByParams(appId: String!): [DependencyType]
  }
`;

export default ApplicationQueriesType;
