import { DataTypes, Model, Sequelize } from 'sequelize';

interface AccountApplicationType {
    accountId: number;
    appId: number;
}

export class AccountApplicationModelType
    extends Model<AccountApplicationType>
    implements AccountApplicationType
{
    declare accountId: number;
    declare appId: number;
}

const accountApplicationSchema = {
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    appId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
};

const accountApplicationOptions = {
    indexes: [{ unique: true, fields: ['account_id', 'app_id'] }],
};

const initializeAccountApplicationModel = (sequelize: Sequelize) => {
    AccountApplicationModelType.init(accountApplicationSchema, {
        sequelize,
        modelName: 'AccountApplication',
        ...accountApplicationOptions,
    });

    return AccountApplicationModelType;
};

export default initializeAccountApplicationModel;
