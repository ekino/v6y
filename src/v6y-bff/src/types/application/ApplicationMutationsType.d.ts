declare const ApplicationMutationsType = "\n  type Mutation {\n    createOrEditApplication(applicationInput: ApplicationCreateOrEditInput!): ApplicationType\n    deleteApplication(input: ApplicationDeleteInput!): ApplicationDeleteOutput\n  }\n";
export default ApplicationMutationsType;
