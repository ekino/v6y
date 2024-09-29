import { EvolutionHelpInputType, EvolutionHelpType } from '../types/EvolutionHelpType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { EvolutionHelpModelType } from './models/EvolutionHelpModel.ts';
declare const EvolutionHelpProvider: {
    initDefaultData: () => Promise<boolean>;
    createEvolutionHelp: (evolutionHelp: EvolutionHelpInputType) => Promise<EvolutionHelpModelType | null>;
    editEvolutionHelp: (evolutionHelp: EvolutionHelpInputType) => Promise<{
        _id: number;
    } | null>;
    deleteEvolutionHelp: ({ _id }: EvolutionHelpType) => Promise<{
        _id: number;
    } | null>;
    deleteEvolutionHelpList: () => Promise<boolean>;
    getEvolutionHelpListByPageAndParams: ({ start, limit, sort }: SearchQueryType) => Promise<EvolutionHelpType[]>;
    getEvolutionHelpDetailsByParams: ({ _id, category }: EvolutionHelpType) => Promise<EvolutionHelpType | null>;
};
export default EvolutionHelpProvider;
