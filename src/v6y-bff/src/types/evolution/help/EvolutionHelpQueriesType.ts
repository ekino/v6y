const EvolutionHelpQueriesType = `
  type Query {
    getEvolutionHelpListByPageAndParams(start: Int, limit: Int, where: JSON, sort: String): [EvolutionHelpType]
    getEvolutionHelpDetailsByParams(_id: Int!): EvolutionHelpType
    getEvolutionHelpStatus(where: JSON, sort: [String]): [EvolutionHelpStatusType]
  }
`;

export default EvolutionHelpQueriesType;
