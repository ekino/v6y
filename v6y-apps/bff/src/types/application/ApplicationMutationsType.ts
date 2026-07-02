const ApplicationMutationsType = `
  type Mutation {
    createOrEditApplication(applicationInput: ApplicationCreateOrEditInput!): ApplicationType
    deleteApplication(input: ApplicationDeleteInput!): ApplicationDeleteOutput
    triggerApplicationAnalysis(input: TriggerApplicationAnalysisInput!): TriggerApplicationAnalysisOutput
  }
`;

export default ApplicationMutationsType;
