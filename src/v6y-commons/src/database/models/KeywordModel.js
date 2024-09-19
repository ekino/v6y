import { DataTypes } from 'sequelize';

const keywordModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    label: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    module: {
        type: DataTypes.JSON,
    },
};

const keywordModelOptions = {};

const KeywordModel = {
    name: 'Keyword',
    schema: keywordModelSchema,
    options: keywordModelOptions,
};

export default KeywordModel;
