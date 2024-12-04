import {
    AccountInputType,
    AccountProvider,
    AccountType,
    AccountUpdatePasswordType,
    AppLogger,
    PasswordUtils,
    SearchQueryType,
} from '@v6y/commons';

const { hashPassword } = PasswordUtils;

/**
 * Create or edit account
 * @param _
 * @param params
 * @param context
 */
const createOrEditAccount = async (
    _: unknown,
    params: { input: AccountInputType },
    context: { user: AccountType },
) => {
    try {
        const { _id, username, password, email, role, applications } = params?.input || {};

        AppLogger.info(`[AccountMutations - createOrEditAccount] _id : ${_id}`);
        AppLogger.info(`[AccountMutations - createOrEditAccount] username : ${username}`);
        AppLogger.info(`[AccountMutations - createOrEditAccount] password : ${password}`);
        AppLogger.info(`[AccountMutations - createOrEditAccount] email : ${email}`);
        AppLogger.info(`[AccountMutations - createOrEditAccount] role : ${role}`);
        AppLogger.info(`[AccountMutations - createOrEditAccount] applications : ${applications}`);

        if (_id) {
            let editedAccount = null;
            if (!password) {
                editedAccount = await AccountProvider.editAccount({
                    account: {
                        _id,
                        username,
                        email,
                        role,
                        applications,
                    },
                    currentUser: context.user,
                });
            } else {
                editedAccount = await AccountProvider.editAccount({
                    account: {
                        _id,
                        username,
                        password: await hashPassword(password),
                        email,
                        role,
                        applications,
                    },
                    currentUser: context.user,
                });
            }

            if (!editedAccount || !editedAccount._id) {
                throw new Error('Invalid account');
            }

            AppLogger.info(
                `[AccountMutations - createOrEditAccount] editedAccount : ${editedAccount?._id}`,
            );

            return {
                _id: editedAccount._id,
            };
        }

        if (!password) {
            throw new Error('Password is required');
        }

        const user = await AccountProvider.getAccountDetailsByParams({ email });
        if (user) {
            throw new Error('User already exists with this email');
        }
        const createdAccount = await AccountProvider.createAccount({
            username,
            password: await hashPassword(password),
            email,
            role,
            applications,
        });

        if (!createdAccount || !createdAccount._id) {
            return null;
        }

        AppLogger.info(
            `[AccountMutations - createOrEditAccount] createdAccount : ${createdAccount?._id}`,
        );

        return {
            _id: createdAccount._id,
        };
    } catch (error) {
        AppLogger.info(`[AccountMutations - createOrEditAccount] error : ${error}`);
        return null;
    }
};

/**
 * Update password
 * @param _
 * @param params
 * @param context
 **/
const updateAccountPassword = async (
    _: unknown,
    params: { input: AccountUpdatePasswordType },
    context: { user: AccountType },
) => {
    try {
        const { _id, password } = params?.input || {};

        AppLogger.info(`[AccountMutations - updatePassword] _id : ${_id}`);

        const accountDetails = await AccountProvider.getAccountDetailsByParams({ _id });

        if (!accountDetails) {
            throw new Error('Invalid account');
        }

        const updatedAccount = await AccountProvider.updateAccountPassword({
            _id,
            password: await PasswordUtils.hashPassword(password),
            currentUser: context.user,
        });

        if (!updatedAccount || !updatedAccount._id) {
            throw new Error('Invalid account');
        }

        AppLogger.info(
            `[AccountMutations - updatePassword] updatedAccount : ${updatedAccount._id}`,
        );

        return {
            _id: updatedAccount._id,
        };
    } catch (error) {
        AppLogger.error(`[AccountMutations - updatePassword] error : ${error}`);
        return null;
    }
};

/**
 * Delete account
 * @param _
 * @param params
 */
const deleteAccount = async (
    _: unknown,
    params: { input: SearchQueryType },
    context: { user: AccountType },
) => {
    try {
        const whereClause = params?.input?.where;

        if (!whereClause?.id) {
            return null;
        }
        const accountId = parseInt(whereClause.id, 10);
        AppLogger.info(`[AccountMutations - deleteAccount] accountId : ${accountId}`);

        const user = await AccountProvider.getAccountDetailsByParams({
            _id: accountId,
        });
        if (!user) {
            throw new Error('User does not exist');
        }

        await AccountProvider.deleteAccount({ userToDelete: user, currentUser: context.user });
        AppLogger.info(`[AccountMutations - deleteAccount] deleted account : ${accountId}`);
        return {
            _id: accountId,
        };
    } catch (error) {
        AppLogger.info(`[AccountMutations - deleteAccount] error : ${error}`);
        return null;
    }
};

const AccountMutations = {
    createOrEditAccount,
    updateAccountPassword,
    deleteAccount,
};

export default AccountMutations;
