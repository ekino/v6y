const AppMutationsType = `
  type Mutation {
    createOrEditApplication(applicationInput: AppCreateOrEditInput!): AppType
    deleteApplication(input: AppDeleteInput!): AppDeleteOutput
  }
`;

export default AppMutationsType;
