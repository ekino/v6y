import { DataTypes, Model, Sequelize } from 'sequelize';

import { DependencyStatusHelpType } from '../../types/DependencyStatusHelpType.ts';
import { DependencyType } from '../../types/DependencyType.ts';
import { ModuleType } from '../../types/ModuleType.ts';

export class DependencyModelType extends Model<DependencyType> implements DependencyType {
    declare _id: number;
    declare appId: number;
    declare type?: string;
    declare name?: string;
    declare version?: string;
    declare recommendedVersion?: string;
    declare status?: string;
    declare statusHelp?: DependencyStatusHelpType;
    declare module?: ModuleType;
}

const dependencyModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: DataTypes.INTEGER,
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
