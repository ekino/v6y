import { DataTypes } from 'sequelize';

const keywordModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    label: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    version: {
        type: DataTypes.TEXT,
    },
    module: DataTypes.JSON,
};

const keywordModelOptions = {};

const KeywordModel = {
    name: 'Keyword',
    schema: keywordModelSchema,
    options: keywordModelOptions,
};

export default KeywordModel;
