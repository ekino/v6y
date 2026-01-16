const AuditOperationsType = `
  type TriggerAuditResponse {
    """ Success status of the audit trigger """
    success: Boolean!
    
    """ Response message """
    message: String!
    
    """ Additional data from the audit trigger """
    data: JSON
  }
  
  extend type Query {
    """ Get audit results for an application """
    getApplicationAuditResults(applicationId: Int!, branch: String): [AuditReportType]!
  }
  
  extend type Mutation {
    """ Trigger a new audit for an application """
    triggerApplicationAudit(applicationId: Int!, branch: String): TriggerAuditResponse!
  }
`;

export default AuditOperationsType;
