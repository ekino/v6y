import { DataTypes } from 'sequelize';

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

const FaqModel = {
    name: 'Faq',
    schema: faqSchema,
    options: faqOptions,
};

export default FaqModel;
