import { DataTypes, Model, Sequelize } from 'sequelize';

import { KeywordType } from '../../types/KeywordType.ts';
import { ModuleType } from '../../types/ModuleType.ts';

export class KeywordModelType extends Model<KeywordType> implements KeywordType {
    public _id!: number;
    public appId!: number;
    public label!: string;
    public module?: ModuleType;
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

const initializeKeywordModel = (sequelize: Sequelize) => {
    KeywordModelType.init(keywordModelSchema, {
        sequelize,
        modelName: 'Keyword',
        ...keywordModelOptions,
    });
    return KeywordModelType;
};

export default initializeKeywordModel;
