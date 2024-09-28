declare const EvolutionHelpQueriesType = "\n  type Query {\n    getEvolutionHelpListByPageAndParams(start: Int, limit: Int, where: JSON, sort: String): [EvolutionHelpType]\n    getEvolutionHelpDetailsByParams(_id: Int!): EvolutionHelpType\n    getEvolutionHelpStatus(where: JSON, sort: [String]): [EvolutionHelpStatusType]\n  }\n";
export default EvolutionHelpQueriesType;
