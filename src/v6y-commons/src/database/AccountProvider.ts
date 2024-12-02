import { FindOptions, Op, Sequelize } from 'sequelize';

import AppLogger from '../core/AppLogger.ts';
import { isAdmin, isSuperAdmin } from '../core/PassportUtils.ts';
import { AccountInputType, AccountType } from '../types/AccountType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { AccountModelType } from './models/AccountModel.ts';

/**
 *  Build search query
 * @param searchText
 * @param start
 * @param limit
 * @param sort
 */
const buildSearchQuery = async ({
    searchText = '',
    start = 0,
    limit = 10,
    sort = 'username',
}: SearchQueryType) => {
    const queryOptions: FindOptions = {};

    queryOptions.offset = start;
    queryOptions.limit = limit;

    if (sort) {
        queryOptions.order = [[sort, 'ASC']];
    }

    if (searchText) {
        queryOptions.where = {
            [Op.or]: [
                Sequelize.where(Sequelize.fn('lower', Sequelize.col('username')), {
                    [Op.like]: `%${searchText.toLowerCase()}%`,
                }),
                Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), {
                    [Op.like]: `%${searchText.toLowerCase()}%`,
                }),
            ],
        };
    }

    return queryOptions;
};

/**
 * Create An Account
 * @param account
 */
const createAccount = async (account: AccountInputType) => {
    try {
        AppLogger.info(`[AccountProvider - createAccount] account username: ${account?.username}`);
        AppLogger.info(`[AccountProvider - createAccount] account role: ${account?.role}`);
        AppLogger.info(
            `[AccountProvider - createAccount] account apps: ${account?.applications?.length}`,
        );

        // Check mandatory fields
        if (
            !account?.username ||
            !account?.password ||
            !account?.role ||
            !account?.applications?.length
        ) {
            AppLogger.info(`[AccountProvider - createAccount] Missing mandatory fields`);
            return null;
        }

        const createdAccount = (await AccountModelType.create(account))?.dataValues;

        AppLogger.info(`[AccountProvider - createAccount] createdAccount: ${createdAccount._id}`);

        return createdAccount;
    } catch (error) {
        AppLogger.info(`[AccountProvider - createAccount] error:  ${error}`);

        return null;
    }
};

/**
 * Edit an Account
 * @param account
 */
const editAccount = async ({
    account,
    currentUser,
}: {
    account: AccountInputType;
    currentUser: AccountType;
}) => {
    try {
        if (!(isAdmin(currentUser) || isSuperAdmin(currentUser))) {
            throw new Error('You are not authorized to create an account');
        }

        if (
            !isSuperAdmin(currentUser) &&
            (account.role === 'ADMIN' || account.role === 'SUPERADMIN')
        ) {
            AppLogger.info(`[AccountProvider - createOrEditAccount] role : ${account.role}`);
            throw new Error('You are not authorized to create an admin account');
        }

        AppLogger.info(`[AccountProvider - editAccount] account id: ${account?._id}`);
        AppLogger.info(`[AccountProvider - editAccount] account username: ${account?.username}`);
        AppLogger.info(`[AccountProvider - editAccount] account role: ${account?.role}`);
        AppLogger.info(
            `[AccountProvider - editAccount] account apps: ${account?.applications?.length}`,
        );

        if (
            !account?._id ||
            !account?.username?.length ||
            !account?.role ||
            !account?.applications?.length
        ) {
            AppLogger.info(`[AccountProvider - editAccount] Missing mandatory fields`);
            return null;
        }

        const editedAccount = await AccountModelType.update(account, {
            where: {
                _id: account?._id,
            },
        });

        AppLogger.info(`[AccountProvider - editAccount] editedAccount: ${editedAccount?.[0]}`);

        return {
            _id: account?._id,
        };
    } catch (error) {
        AppLogger.info(`[AccountProvider - editAccount] error:  ${error}`);
        return null;
    }
};

/**
 * Update Account Password
 * @param account
 */

const updateAccountPassword = async ({
    _id,
    password,
    currentUser,
}: {
    _id: number;
    password: string;
    currentUser: AccountType;
}) => {
    try {
        if (currentUser._id !== _id && !isAdmin(currentUser) && !isSuperAdmin(currentUser)) {
            throw new Error('You are not authorized to update this account');
        }

        if (!_id || !password) {
            return null;
        }

        AppLogger.info(`[AccountProvider - updateAccountPassword] _id: ${_id}`);

        const accountDetails = await AccountModelType.findOne({
            where: {
                _id,
            },
        });

        if (!accountDetails) {
            return null;
        }

        await AccountModelType.update(
            {
                password: password,
            },
            {
                where: {
                    _id,
                },
            },
        );

        return {
            _id,
        };
    } catch (error) {
        AppLogger.info(`[AccountProvider - updateAccountPassword] error:  ${error}`);
        return null;
    }
};

/**
 * Delete an Account
 * @param _id
 */
const deleteAccount = async ({
    userToDelete,
    currentUser,
}: {
    userToDelete: AccountType;
    currentUser: AccountType;
}) => {
    try {
        AppLogger.info(`[AccountProvider - deleteAccount] _id: ${userToDelete._id}`);

        if (!(isSuperAdmin(currentUser) || isAdmin(currentUser))) {
            throw new Error('You are not authorized to delete an account');
        }

        if (currentUser._id === userToDelete._id) {
            throw new Error('You cannot delete your own account');
        }

        if (userToDelete.role === 'ADMIN' && !isSuperAdmin(currentUser)) {
            throw new Error('You are not authorized to delete an admin account');
        }

        if (!userToDelete._id) {
            return null;
        }

        await AccountModelType.destroy({
            where: {
                _id: userToDelete._id,
            },
        });

        AppLogger.info(`[AccountProvider - deleteAccount] deleted account: ${userToDelete._id}`);

        return {
            _id: userToDelete._id,
        };
    } catch (error) {
        AppLogger.info(`[AccountProvider - deleteAccount] error:  ${error}`);
        return null;
    }
};

/**
 * Get account details by params
 * @param _id
 * @param email
 **/
const getAccountDetailsByParams = async ({ _id, email }: { _id?: number; email?: string }) => {
    try {
        AppLogger.info(
            `[AccountProvider - getAccountDetailsByParams] _id: ${_id}, email: ${email}`,
        );
        if (!_id && !email) {
            return null;
        }

        const accountDetails = await AccountModelType.findOne({
            where: _id ? { _id } : { email },
        });

        if (!accountDetails) {
            AppLogger.info(`[AccountProvider - getAccountDetailsByParams] account not found`);
            return null;
        }

        AppLogger.info(
            `[AccountProvider - getAccountDetailsByParams] account found, accountDetails: ${accountDetails._id}`,
            `[AccountProvider - getAccountDetailsByParams] accountDetails: ${accountDetails.dataValues._id}`,
        );

        return accountDetails.dataValues;
    } catch (error) {
        AppLogger.info(`[AccountProvider - getAccountDetailsByParams] error: ${error}`);
        return null;
    }
};

/**
 * Get account list by page and params
 * @param searchText
 * @param start
 * @param limit
 * @param sort
 */
const getAccountListByPageAndParams = async ({
    searchText = '',
    start = 0,
    limit = 10,
    sort = 'username',
}: SearchQueryType) => {
    try {
        AppLogger.info(`[AccountProvider - getAccountListByPageAndParams] start: ${start}`);
        AppLogger.info(`[AccountProvider - getAccountListByPageAndParams] limit: ${limit}`);
        AppLogger.info(`[AccountProvider - getAccountListByPageAndParams] sort: ${sort}`);

        const searchQuery = await buildSearchQuery({
            searchText,
            start,
            limit,
            sort,
        });

        AppLogger.info(
            `[AccountProvider - getAccountListByPageAndParams] searchQuery: ${JSON.stringify(searchQuery)}`,
        );

        const accounts = await AccountModelType.findAll();

        AppLogger.info(
            `[AccountProvider - getAccountListByPageAndParams] accountList: ${accounts?.length}`,
        );

        return accounts?.map((item) => item?.dataValues) || [];
    } catch (error) {
        AppLogger.error(`[AccountProvider - getAccountListByPageAndParams] error:  ${error}`);
        return [];
    }
};

const AccountProvider = {
    createAccount,
    editAccount,
    updateAccountPassword,
    deleteAccount,
    getAccountDetailsByParams,
    getAccountListByPageAndParams,
};

export default AccountProvider;
