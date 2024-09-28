import { Model, Sequelize } from 'sequelize';
import { KeywordType } from '../../types/KeywordType.ts';
import { ModuleType } from '../../types/ModuleType.ts';
export declare class KeywordModelType extends Model<KeywordType> implements KeywordType {
    _id: number;
    appId: number;
    label: string;
    module?: ModuleType;
}
declare const initializeKeywordModel: (sequelize: Sequelize) => typeof KeywordModelType;
export default initializeKeywordModel;
