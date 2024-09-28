import { EvolutionHelpStatusType, EvolutionHelpType, SearchQueryType } from '@v6y/commons';
declare const EvolutionHelpQueries: {
    getEvolutionHelpListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<import("@v6y/commons/src/database/models/EvolutionHelpModel.ts").EvolutionHelpModelType[]>;
    getEvolutionHelpDetailsByParams: (_: unknown, args: EvolutionHelpType) => Promise<EvolutionHelpType | null>;
    getEvolutionHelpStatus: (_: unknown, args: SearchQueryType) => Promise<EvolutionHelpStatusType[] | null>;
};
export default EvolutionHelpQueries;
