import { EvolutionHelpType } from './EvolutionHelpType.ts';
import { ModuleType } from './ModuleType.ts';
export interface EvolutionType {
    _id?: number;
    appId?: number;
    category?: string;
    evolutionHelp?: EvolutionHelpType | null;
    module?: ModuleType;
}
