import { DependencyStatusHelpType } from './DependencyStatusHelpType.ts';
import { ModuleType } from './ModuleType.ts';

export interface DependencyType {
    _id?: number;
    appId?: number;
    type?: string;
    name?: string;
    version?: string;
    recommendedVersion?: string;
    status?: string;
    statusHelp?: DependencyStatusHelpType | null;
    module?: ModuleType;
}
