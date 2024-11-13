import {
    AccountInputType,
    AccountProvider,
    AccountType,
    AccountUpdatePasswordType,
    AppLogger,
    PasswordUtils,
    SearchQueryType,
    isAdmin,
    isSuperAdmin,
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
        if (!(isAdmin(context.user) || isSuperAdmin(context.user))) {
            throw new Error('You are not authorized to create an account');
        }
        const { _id, username, password, email, role, applications } = params?.input || {};

        if (!isSuperAdmin(context.user) && role === 'ADMIN') {
            AppLogger.info(`[AccountMutations - createOrEditAccount] role : ${role}`);
            throw new Error('You are not authorized to create an admin account');
        }

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
                    _id,
                    username,
                    email,
                    role,
                    applications,
                });
            } else {
                editedAccount = await AccountProvider.editAccount({
                    _id,
                    username,
                    password: await hashPassword(password),
                    email,
                    role,
                    applications,
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
        if (
            context.user._id !== params.input._id &&
            !isAdmin(context.user) &&
            !isSuperAdmin(context.user)
        ) {
            throw new Error('You are not authorized to update this account');
        }
        const { _id, password } = params?.input || {};

        AppLogger.info(`[AccountMutations - updatePassword] _id : ${_id}`);

        const accountDetails = await AccountProvider.getAccountDetailsByParams({ _id });

        if (!accountDetails) {
            throw new Error('Invalid account');
        }

        const updatedAccount = await AccountProvider.updateAccountPassword({
            _id,
            password: await PasswordUtils.hashPassword(password),
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
    params: { accountInput: SearchQueryType },
    context: { user: AccountType },
) => {
    try {
        const whereClause = params?.accountInput?.where;

        if (!whereClause?.id) {
            return null;
        }
        const accountId = parseInt(whereClause.id, 10);
        AppLogger.info(`[AccountMutations - deleteAccount] accountId : ${accountId}`);

        const userToDelete = await AccountProvider.getAccountDetailsByParams({
            _id: accountId,
        });
        if (!userToDelete) {
            throw new Error('User does not exist');
        }

        if (!(isSuperAdmin(context.user) || isAdmin(context.user))) {
            throw new Error('You are not authorized to delete an account');
        }

        if (context.user._id === userToDelete._id) {
            throw new Error('You cannot delete your own account');
        }

        if (userToDelete.role === 'ADMIN' && !isSuperAdmin(context.user)) {
            throw new Error('You are not authorized to delete an admin account');
        }

        await AccountProvider.deleteAccount({ _id: accountId });

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
