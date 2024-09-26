import { EvolutionHelpType } from './EvolutionHelpType';
import { ModuleType } from './ModuleType';

export interface EvolutionType {
    _id?: number;
    appId?: number;
    category?: string;
    evolutionHelp?: EvolutionHelpType | null;
    module?: ModuleType;
}
