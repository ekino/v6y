const AuditHelpMutationsType = `
  type Mutation {
    createOrEditAuditHelp(auditHelpInput: AuditHelpCreateOrEditInput!): AuditHelpType
    deleteAuditHelp(input: AuditHelpDeleteInput!): AuditHelpDeleteOutput
  }
`;

export default AuditHelpMutationsType;
