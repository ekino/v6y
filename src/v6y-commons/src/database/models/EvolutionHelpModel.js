import { DataTypes } from 'sequelize';

const evolutionHelpModelSchema = {
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
        allowNull: false,
    },
    status: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    links: DataTypes.JSON,
};

const evolutionHelpModelOptions = {
    indexes: [{ unique: true, fields: ['category', 'title', 'status'] }],
};

const EvolutionHelpModelModel = {
    name: 'EvolutionHelp',
    schema: evolutionHelpModelSchema,
    options: evolutionHelpModelOptions,
};

export default EvolutionHelpModelModel;
