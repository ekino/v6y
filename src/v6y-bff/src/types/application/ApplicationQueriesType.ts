const ApplicationQueriesType = `
  type Query {
    getApplicationListByPageAndParams(start: Int, offset: Int, limit: Int, keywords: [String], searchText: String, where: JSON, sort: String): [ApplicationType]
    getApplicationStatsByParams(keywords: [String]): [KeywordStatsType]
    getApplicationTotalByParams(keywords: [String], searchText: String): Int
    getApplicationDetailsInfoByParams(_id: Int!): ApplicationType
    getApplicationDetailsAuditReportsByParams(_id: Int!): [AuditReportType]
    getApplicationDetailsEvolutionsByParams(_id: Int!): [EvolutionType]
    getApplicationDetailsDependenciesByParams(_id: Int!): [DependencyType]
    getApplicationDetailsKeywordsByParams(_id: Int): [KeywordType]
  }
`;

export default ApplicationQueriesType;
