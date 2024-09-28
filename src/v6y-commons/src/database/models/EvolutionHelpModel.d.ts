import { Model, Sequelize } from 'sequelize';
import { EvolutionHelpType } from '../../types/EvolutionHelpType.ts';
import { LinkType } from '../../types/LinkType.ts';
export declare class EvolutionHelpModelType extends Model<EvolutionHelpType> implements EvolutionHelpType {
    _id: number;
    category: string;
    title: string;
    description: string;
    status: string;
    links?: LinkType[];
}
declare const initializeEvolutionHelpModel: (sequelize: Sequelize) => typeof EvolutionHelpModelType;
export default initializeEvolutionHelpModel;
