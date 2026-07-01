const TriggerApplicationAnalysisOutput = `
  type TriggerApplicationAnalysisOutput {
    """ Whether the analysis was triggered successfully """
    success: Boolean!

    """ Message describing the result """
    message: String!

    """ Application ID """
    applicationId: Int!

    """ Git branch analyzed """
    branch: String

    """ The audit run that was created """
    auditRun: AuditRunType
  }
`;

export default TriggerApplicationAnalysisOutput;
