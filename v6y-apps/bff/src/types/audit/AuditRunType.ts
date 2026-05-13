const AuditRunType = `
  type AuditRunType {
    """ Audit Run Unique id """
    _id: Int!

    """ Application ID that this audit run belongs to """
    appId: Int!

    """ Git branch that was analyzed """
    branch: String

    """ Status of the audit run (pending, in_progress, completed, failed) """
    runStatus: String!

    """ Types of analysis performed (static, dynamic, devops) """
    analysisTypes: [String!]!

    """ Audit reports generated in this run """
    audits: [AuditReportType!]!

    """ When the audit run was triggered """
    triggeredAt: String!

    """ When the audit run completed """
    completedAt: String

    """ Error message if the run failed """
    errorMessage: String

    """ When this record was created """
    createdAt: String!

    """ When this record was last updated """
    updatedAt: String!
  }
`;

export default AuditRunType;
