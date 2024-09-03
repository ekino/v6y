const ApplicationMutationsType = `
  type Mutation {
    createOrEditApplication(applicationInput: ApplicationCreateOrEditInput!): ApplicationType
    deleteApplication(input: ApplicationDeleteInput!): ApplicationDeleteOutput
  }
`;

export default ApplicationMutationsType;
