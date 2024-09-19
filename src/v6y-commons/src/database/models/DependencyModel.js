import { DataTypes } from 'sequelize';

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

const DependencyModel = {
    name: 'Dependency',
    schema: dependencyModelSchema,
    options: dependencyModelOptions,
};

export default DependencyModel;
