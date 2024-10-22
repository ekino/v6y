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
    params: { accountInput: AccountInputType },
    context: { user: AccountType },
) => {
    try {
        if (!(isAdmin(context.user) || isSuperAdmin(context.user))) {
            return null;
        }
        const { _id, username, password, email, role, applications } = params?.accountInput || {};

        AppLogger.info(`[AccountMutations - createOrEditAccount] _id : ${_id}`);
        AppLogger.info(`[AccountMutations - createOrEditAccount] username : ${username}`);
        AppLogger.info(`[AccountMutations - createOrEditAccount] password : ${password}`);
        AppLogger.info(`[AccountMutations - createOrEditAccount] email : ${email}`);
        AppLogger.info(`[AccountMutations - createOrEditAccount] role : ${role}`);
        AppLogger.info(
            `[AccountMutations - createOrEditAccount] applications : ${applications?.join(',')}`,
        );

        if (_id) {
            const editedAccount = await AccountProvider.editAccount({
                _id,
                username,
                password: await hashPassword(password),
                email,
                role,
                applications,
            });

            if (!editedAccount || !editedAccount._id) {
                return null;
            }

            AppLogger.info(
                `[AccountMutations - createOrEditAccount] editedAccount : ${editedAccount?._id}`,
            );

            return {
                _id: editedAccount._id,
            };
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
            return null;
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
const deleteAccount = async (_: unknown, params: { input: SearchQueryType }) => {
    try {
        const whereClause = params?.input?.where;
        if (!whereClause) {
            return null;
        }

        const accountId = whereClause._id;
        AppLogger.info(`[AccountMutations - deleteAccount] accountId : ${accountId}`);

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
