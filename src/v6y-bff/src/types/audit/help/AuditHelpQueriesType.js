const AuditHelpQueriesType = `
  type Query {
    getAuditHelpListByPageAndParams(offset: Int, limit: Int, where: JSON, sort: String): [AuditHelpType]
    getAuditHelpDetailsByParams(auditHelpId: String!): AuditHelpType
  }
`;

export default AuditHelpQueriesType;
