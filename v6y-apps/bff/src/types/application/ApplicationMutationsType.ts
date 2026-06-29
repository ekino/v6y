const ApplicationMutationsType = `
  type Mutation {
    createOrEditApplication(applicationInput: ApplicationCreateOrEditInput!): ApplicationType
    deleteApplication(input: ApplicationDeleteInput!): ApplicationDeleteOutput
    triggerApplicationAnalysis(applicationId: Int!): ApplicationAnalysisTriggerOutput!
  }
`;

export default ApplicationMutationsType;
