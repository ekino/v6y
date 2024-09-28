import { Model, Sequelize } from 'sequelize';
import { EvolutionHelpType } from '../../types/EvolutionHelpType.ts';
import { EvolutionType } from '../../types/EvolutionType.ts';
import { ModuleType } from '../../types/ModuleType.ts';
export declare class EvolutionModelType extends Model<EvolutionType> implements EvolutionType {
    _id: number;
    appId: number;
    category: string;
    evolutionHelp?: EvolutionHelpType;
    module?: ModuleType;
}
declare const initializeEvolutionModel: (sequelize: Sequelize) => typeof EvolutionModelType;
export default initializeEvolutionModel;
