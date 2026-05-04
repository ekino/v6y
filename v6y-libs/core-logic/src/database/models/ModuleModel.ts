import { DataTypes, Model, Sequelize } from 'sequelize';

import { ModuleType } from '../../types/ModuleType.ts';

export class ModuleModelType extends Model<ModuleType> implements ModuleType {
    declare _id: number;
    declare appId: number;
    declare branch?: string;
    declare path?: string;
    declare url?: string;
    declare status?: string;
    declare version?: string;
}

const moduleSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    branch: {
        type: DataTypes.TEXT,
    },
    path: {
        type: DataTypes.TEXT,
    },
    url: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.TEXT,
    },
    version: {
        type: DataTypes.TEXT,
    },
};

const moduleOptions = {
    indexes: [{ unique: true, fields: ['app_id', 'branch', 'path'] }],
};

const initializeModuleModel = (sequelize: Sequelize) => {
    ModuleModelType.init(moduleSchema, {
        sequelize,
        modelName: 'Module',
        ...moduleOptions,
    });

    return ModuleModelType;
};

export default initializeModuleModel;
