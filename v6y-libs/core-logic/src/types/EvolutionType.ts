import { EvolutionHelpType } from './EvolutionHelpType.ts';
import { ModuleType } from './ModuleType.ts';

export interface EvolutionType {
    _id?: number;
    appId?: number;
    moduleId?: number;
    evolutionHelpId?: number;
    category?: string;
    /** Resolved via JOIN on read; accepted as input for write (triggers findOrCreate). */
    evolutionHelp?: EvolutionHelpType | null;
    /** Resolved via JOIN on read; accepted as input for write (triggers findOrCreate). */
    module?: ModuleType;
}
