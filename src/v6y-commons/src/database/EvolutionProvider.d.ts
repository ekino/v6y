import { EvolutionType } from '../types/EvolutionType.ts';
import { EvolutionModelType } from './models/EvolutionModel.ts';
declare const EvolutionProvider: {
    createEvolution: (evolution: EvolutionType) => Promise<EvolutionModelType | null>;
    insertEvolutionList: (evolutionList: EvolutionType[]) => Promise<null | undefined>;
    editEvolution: (evolution: EvolutionType) => Promise<{
        _id: number;
    } | null>;
    deleteEvolution: ({ _id }: EvolutionType) => Promise<{
        _id: number;
    } | null>;
    deleteEvolutionList: () => Promise<boolean>;
    getEvolutionListByPageAndParams: ({ appId }: EvolutionType) => Promise<EvolutionModelType[]>;
};
export default EvolutionProvider;
