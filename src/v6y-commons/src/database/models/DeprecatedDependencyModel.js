import { DataTypes } from 'sequelize';

const deprecatedDependencyModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
};

const deprecatedDependencyModelOptions = {
    indexes: [{ unique: true, fields: ['name'] }],
};

const DeprecatedDependencyModel = {
    name: 'DeprecatedDependency',
    schema: deprecatedDependencyModelSchema,
    options: deprecatedDependencyModelOptions,
};

export default DeprecatedDependencyModel;
