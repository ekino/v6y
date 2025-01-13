const EvolutionHelpMutationsType = `
  type Mutation {
    createOrEditEvolutionHelp(evolutionHelpInput: EvolutionHelpCreateOrEditInput!): EvolutionHelpType
    deleteEvolutionHelp(input: EvolutionHelpDeleteInput!): EvolutionHelpDeleteOutput
  }
`;

export default EvolutionHelpMutationsType;
