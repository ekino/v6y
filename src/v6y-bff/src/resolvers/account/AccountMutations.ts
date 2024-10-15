import { AccountInputType, AccountProvider, AppLogger, SearchQueryType } from '@v6y/commons';

const hashPassword = (password: string) => {
    return password;
};

/**
 * Create or edit account
 * @param _
 * @param params
 */
const createOrEditAccount = async (_: unknown, params: { accountInput: AccountInputType }) => {
    try {
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
                password: hashPassword(password),
                email,
                role,
                applications,
            });

            AppLogger.info(
                `[AccountMutations - createOrEditAccount] editedAccount : ${editedAccount?._id}`,
            );

            return {
                _id,
            };
        }

        const createdAccount = await AccountProvider.createAccount({
            username,
            password,
            email,
            role,
            applications,
        });

        AppLogger.info(
            `[AccountMutations - createOrEditAccount] createdAccount : ${createdAccount?._id}`,
        );

        return createdAccount;
    } catch (error) {
        AppLogger.info(`[AccountMutations - createOrEditAccount] error : ${error}`);
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
    deleteAccount,
};

export default AccountMutations;
