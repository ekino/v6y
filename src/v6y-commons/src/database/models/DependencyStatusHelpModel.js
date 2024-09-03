import { DataTypes } from 'sequelize';

const dependencyStatusHelpModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    category: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    links: DataTypes.JSON,
};

const dependencyStatusHelpModelOptions = {
    indexes: [{ unique: true, fields: ['category', 'title'] }],
};

const DependencyStatusHelpModel = {
    name: 'DependencyStatusHelp',
    schema: dependencyStatusHelpModelSchema,
    options: dependencyStatusHelpModelOptions,
};

export default DependencyStatusHelpModel;
