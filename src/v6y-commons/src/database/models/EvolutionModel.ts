import { DataTypes, Model, Sequelize } from 'sequelize';

import { EvolutionHelpType } from '../../types/EvolutionHelpType.ts';
import { EvolutionType } from '../../types/EvolutionType.ts';
import { ModuleType } from '../../types/ModuleType.ts';

export class EvolutionModelType extends Model<EvolutionType> implements EvolutionType {
    public _id!: number;
    public appId!: number;
    public category!: string;
    public evolutionHelp?: EvolutionHelpType;
    public module?: ModuleType;
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
    evolutionHelp: {
        type: DataTypes.JSON,
    },
    module: {
        type: DataTypes.JSON,
    },
};

const evolutionModelOptions = {};

const initializeEvolutionModel = (sequelize: Sequelize) => {
    EvolutionModelType.init(evolutionModelSchema, {
        sequelize,
        modelName: 'Evolution',
        ...evolutionModelOptions,
    });
    return EvolutionModelType;
};

export default initializeEvolutionModel;
