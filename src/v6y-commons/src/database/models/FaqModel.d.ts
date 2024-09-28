import { Model, Sequelize } from 'sequelize';
import { FaqType } from '../../types/FaqType.ts';
import { LinkType } from '../../types/LinkType.ts';
export declare class FaqModelType extends Model<FaqType> implements FaqType {
    _id: number;
    title: string;
    description: string;
    links?: LinkType[];
}
declare const initializeFaqModel: (sequelize: Sequelize) => typeof FaqModelType;
export default initializeFaqModel;
