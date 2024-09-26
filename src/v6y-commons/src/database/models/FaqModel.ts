import { DataTypes, Model, Sequelize } from 'sequelize';

import { FaqType } from '../../types/FaqType';
import { LinkType } from '../../types/LinkType';

export class FaqModelType extends Model<FaqType> implements FaqType {
    public _id!: number;
    public title!: string;
    public description!: string;
    public links?: LinkType[];
}

const faqSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    links: {
        type: DataTypes.JSON,
    },
};

const faqOptions = {
    indexes: [{ unique: true, fields: ['title'] }],
};

const initializeFaqModel = (sequelize: Sequelize) => {
    FaqModelType.init(faqSchema, {
        sequelize,
        modelName: 'Faq',
        ...faqOptions,
    });
    return FaqModelType;
};

export default initializeFaqModel;
