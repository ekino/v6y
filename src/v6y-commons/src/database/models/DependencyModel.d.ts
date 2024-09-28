import { Model, Sequelize } from 'sequelize';
import { DependencyStatusHelpType } from '../../types/DependencyStatusHelpType.ts';
import { DependencyType } from '../../types/DependencyType.ts';
import { ModuleType } from '../../types/ModuleType.ts';
export declare class DependencyModelType extends Model<DependencyType> implements DependencyType {
    _id: number;
    appId: number;
    type?: string;
    name?: string;
    version?: string;
    recommendedVersion?: string;
    status?: string;
    statusHelp?: DependencyStatusHelpType;
    module?: ModuleType;
}
declare const initializeDependencyModel: (sequelize: Sequelize) => typeof DependencyModelType;
export default initializeDependencyModel;
