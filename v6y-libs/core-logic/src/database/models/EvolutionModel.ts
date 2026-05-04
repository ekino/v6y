import { DataTypes, Model, Sequelize } from 'sequelize';

import { EvolutionHelpType } from '../../types/EvolutionHelpType.ts';
import { EvolutionType } from '../../types/EvolutionType.ts';
import { ModuleType } from '../../types/ModuleType.ts';

export class EvolutionModelType extends Model<EvolutionType> implements EvolutionType {
    declare _id: number;
    declare appId: number;
    declare category: string;
    declare evolutionHelp?: EvolutionHelpType;
    declare module?: ModuleType;
}

const evolutionModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
};

const evolutionModelOptions = {};

const initializeEvolutionModel = (sequelize: Sequelize) => {
    EvolutionModelType.init(evolutionModelSchema, {
        sequelize,
        modelName: 'Evolution',
        tableName: 'evolution',
        ...evolutionModelOptions,
    });
    return EvolutionModelType;
};

export default initializeEvolutionModel;
