import { DataTypes, Model, Sequelize } from 'sequelize';

import { DependencyType } from '../../types/DependencyType.ts';
import { DependencyVersionStatusHelpType } from '../../types/DependencyVersionStatusHelpType.ts';
import { ModuleType } from '../../types/ModuleType.ts';

export class DependencyModelType extends Model<DependencyType> implements DependencyType {
    public _id!: number;
    public appId!: number;
    public type?: string;
    public name?: string;
    public version?: string;
    public recommendedVersion?: string;
    public versionStatus?: string;
    public versionStatusHelp?: DependencyVersionStatusHelpType;
    public module?: ModuleType;
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
    versionStatus: {
        type: DataTypes.TEXT,
    },
    versionStatusHelp: {
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
