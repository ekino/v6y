import { Model, Sequelize } from 'sequelize';
import { ApplicationType } from '../../types/ApplicationType.ts';
import { LinkType } from '../../types/LinkType.ts';
import { RepositoryType } from '../../types/RepositoryType.ts';
export declare class ApplicationModelType extends Model<ApplicationType> implements ApplicationType {
    _id: number;
    name: string;
    acronym: string;
    contactMail: string;
    description: string;
    repo?: RepositoryType;
    links?: LinkType[];
}
declare const initializeApplicationModel: (sequelize: Sequelize) => typeof ApplicationModelType;
export default initializeApplicationModel;
