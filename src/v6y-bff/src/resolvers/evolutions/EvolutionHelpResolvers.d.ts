declare const EvolutionHelpResolvers: {
    Query: {
        getEvolutionHelpListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons").EvolutionHelpType[]>;
        getEvolutionHelpDetailsByParams: (_: unknown, args: import("@v6y/commons").EvolutionHelpType) => Promise<import("@v6y/commons").EvolutionHelpType | null>;
        getEvolutionHelpStatus: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons").EvolutionHelpStatusType[] | null>;
    };
    Mutation: {
        createOrEditEvolutionHelp: (_: unknown, params: {
            evolutionHelpInput: import("@v6y/commons").EvolutionHelpInputType;
        }) => Promise<import("@v6y/commons/src/database/models/EvolutionHelpModel.ts").EvolutionHelpModelType | {
            _id: number;
        } | null>;
        deleteEvolutionHelp: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: number;
        } | null>;
    };
};
export default EvolutionHelpResolvers;
