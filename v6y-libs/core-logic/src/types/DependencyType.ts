import { DependencyVersionStatusHelpType } from './DependencyVersionStatusHelpType.ts';
import { ModuleType } from './ModuleType.ts';

export interface DependencyType {
    _id?: number;
    appId?: number;
    type?: string;
    name?: string;
    version?: string;
    recommendedVersion?: string;
    versionStatus?: string;
    versionStatusHelp?: DependencyVersionStatusHelpType | null;
    module?: ModuleType;
}
