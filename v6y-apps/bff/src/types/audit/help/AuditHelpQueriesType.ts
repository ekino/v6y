const AuditHelpQueriesType = `
  type Query {
    getAuditHelpListByPageAndParams(start: Int, limit: Int, where: JSON, sort: String): [AuditHelpType]
    getAuditHelpDetailsByParams(_id: Int!): AuditHelpType
  }
`;

export default AuditHelpQueriesType;
