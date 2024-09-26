import { DependencyStatusHelpType } from './DependencyStatusHelpType';
import { ModuleType } from './ModuleType';

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
