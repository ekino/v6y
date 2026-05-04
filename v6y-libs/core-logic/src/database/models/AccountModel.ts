import { DataTypes, Model, Sequelize } from 'sequelize';

import { AccountType } from '../../types/AccountType.ts';

export class AccountModelType extends Model<AccountType> implements AccountType {
    declare _id: number;
    declare username: string;
    declare email: string;
    declare password: string;
    declare role: string;
    declare applications?: number[];
}

const accountSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    role: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    applications: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
};

const accountOptions = {
    indexes: [{ unique: true, fields: ['username', 'email'] }],
};

const initializeAccountModel = (sequelize: Sequelize) => {
    AccountModelType.init(accountSchema, {
        sequelize,
        modelName: 'Account',
        ...accountOptions,
    });

    return AccountModelType;
};

export default initializeAccountModel;
