const ApplicationQueriesType = `
  type Query {
    getApplicationListByPageAndParams(start: Int, offset: Int, limit: Int, keywords: [String], searchText: String, where: JSON, sort: String): [ApplicationType]
    getApplicationStatsByParams(keywords: [String]): [KeywordStatsType]
    getApplicationTotalByParams(keywords: [String], searchText: String): Int
    getApplicationDetailsInfoByParams(_id: Int!): ApplicationType
    getApplicationDetailsAuditReportsByParams(_id: Int!): [AuditReportType]
    getApplicationAuditRunsByParams(_id: Int!): [AuditRunType]
    getApplicationDetailsEvolutionsByParams(_id: Int!): [EvolutionType]
    getApplicationDetailsDependenciesByParams(_id: Int!): [DependencyType]
    getApplicationDetailsKeywordsByParams(_id: Int): [KeywordType]
    getApplicationAuditHistoryByParams(_id: Int!, limit: Int, offset: Int): [AuditRunType]
    getApplicationAuditHistoryCountByParams(_id: Int!): Int
    getApplicationLatestAuditRunByParams(_id: Int!): AuditRunType
    getAuditRunDetailsByParams(_id: Int!): AuditRunType
  }
`;

export default ApplicationQueriesType;
