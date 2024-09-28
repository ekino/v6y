declare const AuditHelpQueriesType = "\n  type Query {\n    getAuditHelpListByPageAndParams(start: Int, limit: Int, where: JSON, sort: String): [AuditHelpType]\n    getAuditHelpDetailsByParams(_id: Int!): AuditHelpType\n  }\n";
export default AuditHelpQueriesType;
