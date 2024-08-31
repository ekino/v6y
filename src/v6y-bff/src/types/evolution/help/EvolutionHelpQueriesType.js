const EvolutionHelpQueriesType = `
  type Query {
    getEvolutionHelpListByPageAndParams(start: Int, limit: Int, where: JSON, sort: String): [EvolutionHelpType]
    getEvolutionHelpDetailsByParams(evolutionHelpId: String!): EvolutionHelpType
    getEvolutionHelpStatus: [String]
  }
`;

export default EvolutionHelpQueriesType;
