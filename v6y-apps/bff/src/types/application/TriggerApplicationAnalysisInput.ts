const TriggerApplicationAnalysisInput = `
  input TriggerApplicationAnalysisInput {
    """ Application ID to analyze """
    applicationId: Int!

    """ Git branch to analyze """
    branch: String

    """ Types of analysis to run (static, dynamic, devops) """
    analysisTypes: [String!]!
  }
`;

export default TriggerApplicationAnalysisInput;
