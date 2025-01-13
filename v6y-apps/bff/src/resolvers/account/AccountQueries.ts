import {
    AccountLoginType,
    AccountProvider,
    AccountType,
    AppLogger,
    PasswordUtils,
    SearchQueryType,
    generateAuthenticationToken,
} from '@v6y/core-logic';

const { validatePassword } = PasswordUtils;

/**
 * Fetch the Account details by parameters
 * @param _
 * @param args
 */
const getAccountDetailsByParams = async (_: unknown, args: AccountType) => {
    try {
        const { _id } = args || {};

        AppLogger.info(`[AccountQueries - getAccountDetailsByParams] _id : ${_id}`);

        if (!_id) {
            return null;
        }

        const accountDetails = await AccountProvider.getAccountDetailsByParams({
            _id,
        });

        AppLogger.info(
            `[AccountQueries - getAccountDetailsByParams] accountDetails : ${accountDetails?._id}`,
        );

        return accountDetails;
    } catch (error) {
        AppLogger.info(`[AccountQueries - getAccountDetailsByParams] error : ${error}`);
        return null;
    }
};

/**
 * Fetch the Account list by page and parameters
 * @param _
 * @param args
 */
const getAccountListByPageAndParams = async (_: unknown, args: SearchQueryType) => {
    try {
        const { searchText, start, limit, sort } = args || {};

        // Log the input parameters for debugging/tracking purposes
        AppLogger.info(`[AccountQueries - getAccountListByPageAndParams] start : ${start}`);
        AppLogger.info(`[AccountQueries - getAccountListByPageAndParams] limit : ${limit}`);
        AppLogger.info(`[AccountQueries - getAccountListByPageAndParams] sort : ${sort}`);

        // Fetch the Account list (Note: the provided arguments are not being used in the call)
        const accountList = await AccountProvider.getAccountListByPageAndParams({
            searchText,
            start,
            limit,
            sort,
        });

        AppLogger.info(
            `[AccountQueries - getAccountListByPageAndParams] accountList : ${accountList?.length}`,
        );

        return accountList;
    } catch (error) {
        AppLogger.error(`[AccountQueries - getFaqListByPageAndParams] error : ${error}`);
        return [];
    }
};

/**
 * Login account
 * @param _
 * @param params
 */
const loginAccount = async (_: unknown, params: { input: AccountLoginType }) => {
    try {
        const { email, password } = params?.input || {};
        AppLogger.info(`[AccountMutations - loginAccount] username : ${email}`);

        if (!email || !password) {
            return null;
        }

        const accountDetails = await AccountProvider.getAccountDetailsByParams({
            email,
        });

        AppLogger.info(`[AccountMutations - loginAccount] accountDetails : ${accountDetails?._id}`);

        if (!accountDetails || !accountDetails.password || !accountDetails._id) {
            return null;
        }

        const isPasswordMatch = await validatePassword(password, accountDetails.password);

        if (!isPasswordMatch) {
            return null;
        }

        const token = generateAuthenticationToken(accountDetails);

        AppLogger.info(
            `[AccountMutations - loginAccount] login success : ${accountDetails._id} - ${accountDetails.role}`,
        );

        return {
            _id: accountDetails._id,
            token,
            role: accountDetails.role,
        };
    } catch (error) {
        AppLogger.info(`[AccountMutations - loginAccount] error : ${error}`);
        return null;
    }
};

const AccountQueries = {
    getAccountListByPageAndParams,
    getAccountDetailsByParams,
    loginAccount,
};

export default AccountQueries;
