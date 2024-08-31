const DeprecatedDependencyMutationsType = `
  type Mutation {
    createOrEditDeprecatedDependency(deprecatedDependencyInput: DeprecatedDependencyCreateOrEditInput!): DeprecatedDependencyType
    deleteDeprecatedDependency(input: DeprecatedDependencyDeleteInput!): DeprecatedDependencyDeleteOutput
  }
`;

export default DeprecatedDependencyMutationsType;
