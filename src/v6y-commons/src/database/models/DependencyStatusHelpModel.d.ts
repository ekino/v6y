import { Model, Sequelize } from 'sequelize';
import { DependencyStatusHelpType } from '../../types/DependencyStatusHelpType.ts';
import { LinkType } from '../../types/LinkType.ts';
export declare class DependencyStatusHelpModelType extends Model<DependencyStatusHelpType> implements DependencyStatusHelpType {
    _id: number;
    category: string;
    title: string;
    description?: string;
    links?: LinkType[] | undefined;
}
declare const initializeDependencyStatusHelpModel: (sequelize: Sequelize) => typeof DependencyStatusHelpModelType;
export default initializeDependencyStatusHelpModel;
