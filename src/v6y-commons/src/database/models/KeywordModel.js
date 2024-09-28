import { DataTypes, Model } from 'sequelize';
export class KeywordModelType extends Model {
    _id;
    appId;
    label;
    module;
}
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
const initializeKeywordModel = (sequelize) => {
    KeywordModelType.init(keywordModelSchema, {
        sequelize,
        modelName: 'Keyword',
        ...keywordModelOptions,
    });
    return KeywordModelType;
};
export default initializeKeywordModel;
