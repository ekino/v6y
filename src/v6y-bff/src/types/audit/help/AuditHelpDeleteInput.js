const AuditHelpDeleteInput = `
  input AuditHelpDeleteInputClause {
      """ Audit Help to delete id """
      id: String!
  }
  
  input AuditHelpDeleteInput {
      """ Audit Help to delete id """
      where: AuditHelpDeleteInputClause!
  }
`;

export default AuditHelpDeleteInput;
