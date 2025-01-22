const DependencyVersionStatusHelpMutationsType = `
  type Mutation {
    createOrEditDependencyVersionStatusHelp(dependencyVersionStatusHelpInput: DependencyVersionStatusHelpCreateOrEditInput!): DependencyVersionStatusHelpType
    deleteDependencyVersionStatusHelp(input: DependencyVersionStatusHelpDeleteInput!): DependencyVersionStatusHelpDeleteOutput
  }
`;

export default DependencyVersionStatusHelpMutationsType;
