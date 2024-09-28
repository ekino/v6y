import { DataTypes, Model } from 'sequelize';
export class FaqModelType extends Model {
    _id;
    title;
    description;
    links;
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
const initializeFaqModel = (sequelize) => {
    FaqModelType.init(faqSchema, {
        sequelize,
        modelName: 'Faq',
        ...faqOptions,
    });
    return FaqModelType;
};
export default initializeFaqModel;
