import { Model, Sequelize } from 'sequelize';
import { DeprecatedDependencyType } from '../../types/DeprecatedDependencyType.ts';
export declare class DeprecatedDependencyModelType extends Model<DeprecatedDependencyType> implements DeprecatedDependencyType {
    _id: number;
    name: string;
}
declare const initializeDeprecatedDependencyModel: (sequelize: Sequelize) => typeof DeprecatedDependencyModelType;
export default initializeDeprecatedDependencyModel;
