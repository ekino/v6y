"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeywordModelType = void 0;
const sequelize_1 = require("sequelize");
class KeywordModelType extends sequelize_1.Model {
    _id;
    appId;
    label;
    module;
}
exports.KeywordModelType = KeywordModelType;
const keywordModelSchema = {
    _id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    label: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    module: {
        type: sequelize_1.DataTypes.JSON,
    },
};
const keywordModelOptions = {};
const initializeKeywordModel = (sequelize) => {
    KeywordModelType.init(keywordModelSchema, {
        sequelize,
        modelName: 'Keyword',
        ...keywordModelOptions,
    });
    return KeywordModelType;
};
exports.default = initializeKeywordModel;
