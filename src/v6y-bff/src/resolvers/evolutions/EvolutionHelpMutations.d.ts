import { EvolutionHelpInputType, SearchQueryType } from '@v6y/commons';
declare const EvolutionHelpMutations: {
    createOrEditEvolutionHelp: (_: unknown, params: {
        evolutionHelpInput: EvolutionHelpInputType;
    }) => Promise<import("@v6y/commons/src/database/models/EvolutionHelpModel.ts").EvolutionHelpModelType | {
        _id: number;
    } | null>;
    deleteEvolutionHelp: (_: unknown, params: {
        input: SearchQueryType;
    }) => Promise<{
        _id: number;
    } | null>;
};
export default EvolutionHelpMutations;
