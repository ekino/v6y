import { DependencyStatusHelpType } from './DependencyStatusHelpType.ts';
import { ModuleType } from './ModuleType.ts';

export interface DependencyType {
    _id?: number;
    appId?: number;
    moduleId?: number;
    statusHelpId?: number;
    type?: string;
    name?: string;
    version?: string;
    recommendedVersion?: string;
    status?: string;
    /** Resolved via JOIN on read; accepted as input for write (triggers findOrCreate). */
    statusHelp?: DependencyStatusHelpType | null;
    /** Resolved via JOIN on read; accepted as input for write (triggers findOrCreate). */
    module?: ModuleType;
}
