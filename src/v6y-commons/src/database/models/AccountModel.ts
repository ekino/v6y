import { DataTypes, Model, Sequelize } from 'sequelize';

import { AccountType } from '../../types/AccountType.ts';

export class AccountModelType extends Model<AccountType> implements AccountType {
    public _id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public role!: string;
    public applications?: number[];
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
