import { DataTypes, Model, Sequelize } from 'sequelize';

import { DependencyStatusHelpType } from '../../types/DependencyStatusHelpType';
import { DependencyType } from '../../types/DependencyType';
import { ModuleType } from '../../types/ModuleType';

export class DependencyModelType extends Model<DependencyType> implements DependencyType {
    public _id!: number;
    public appId!: number;
    public type?: string;
    public name?: string;
    public version?: string;
    public recommendedVersion?: string;
    public status?: string;
    public statusHelp?: DependencyStatusHelpType;
    public module?: ModuleType;
}

const dependencyModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.TEXT,
    },
    name: {
        type: DataTypes.TEXT,
    },
    version: {
        type: DataTypes.TEXT,
    },
    recommendedVersion: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.TEXT,
    },
    statusHelp: {
        type: DataTypes.JSON,
    },
    module: {
        type: DataTypes.JSON,
    },
};

const dependencyModelOptions = {};

const initializeDependencyModel = (sequelize: Sequelize) => {
    DependencyModelType.init(dependencyModelSchema, {
        sequelize,
        modelName: 'Dependency',
        ...dependencyModelOptions,
    });
    return DependencyModelType;
};

export default initializeDependencyModel;
