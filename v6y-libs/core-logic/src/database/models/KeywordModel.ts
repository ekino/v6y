import { DataTypes, Model, Sequelize } from 'sequelize';

import { KeywordType } from '../../types/KeywordType.ts';
import { ModuleType } from '../../types/ModuleType.ts';

export class KeywordModelType extends Model<KeywordType> implements KeywordType {
    declare _id: number;
    declare appId: number;
    declare label: string;
    declare module?: ModuleType;
}

const keywordModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    label: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
};

const keywordModelOptions = {};

const initializeKeywordModel = (sequelize: Sequelize) => {
    KeywordModelType.init(keywordModelSchema, {
        sequelize,
        modelName: 'Keyword',
        ...keywordModelOptions,
    });
    return KeywordModelType;
};

export default initializeKeywordModel;
