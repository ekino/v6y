const DependencyStatusHelpMutationsType = `
  type Mutation {
    createOrEditDependencyStatusHelp(dependencyStatusHelpInput: DependencyStatusHelpCreateOrEditInput!): DependencyStatusHelpType
    deleteDependencyStatusHelp(input: DependencyStatusHelpDeleteInput!): DependencyStatusHelpDeleteOutput
  }
`;

export default DependencyStatusHelpMutationsType;
