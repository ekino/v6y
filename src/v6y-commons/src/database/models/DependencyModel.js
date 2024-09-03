import { DataTypes } from 'sequelize';

const dependencyModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    statusHelp: DataTypes.JSON,
    module: DataTypes.JSON,
};

const dependencyModelOptions = {
    indexes: [{ unique: true, fields: ['type', 'name', 'status'] }],
};

const DependencyModel = {
    name: 'Dependency',
    schema: dependencyModelSchema,
    options: dependencyModelOptions,
};

export default DependencyModel;
