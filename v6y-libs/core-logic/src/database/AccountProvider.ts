import AppLogger from '../core/AppLogger.ts';
import { isAdmin, isSuperAdmin } from '../core/AuthenticationHelper.ts';
import {
    AccountInputType,
    AccountNotificationSettingsInputType,
    AccountType,
    SearchQueryType,
} from '../types/index.ts';
import { getPrismaClient } from './PrismaClient.ts';

const createAccount = async (account: AccountInputType) => {
    try {
        AppLogger.info(`[AccountProvider - createAccount] account username: ${account?.username}`);
        AppLogger.info(`[AccountProvider - createAccount] account role: ${account?.role}`);
        AppLogger.info(
            `[AccountProvider - createAccount] account apps: ${account?.applications?.length}`,
        );

        if (
            !account?.username ||
            !account?.password ||
            !account?.role ||
            !account?.applications?.length
        ) {
            AppLogger.info(`[AccountProvider - createAccount] Missing mandatory fields`);
            return null;
        }

        const createdAccount = await getPrismaClient().account.create({
            data: {
                username: account.username,
                email: account.email,
                password: account.password,
                role: account.role,
                applications: account.applications ?? [],
            },
        });

        AppLogger.info(`[AccountProvider - createAccount] createdAccount: ${createdAccount.id}`);
        return { ...createdAccount, _id: createdAccount.id };
    } catch (error) {
        AppLogger.error(`[AccountProvider - createAccount] error: `, error);
        return null;
    }
};

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

        if (
            !account?._id ||
            !account?.username?.length ||
            !account?.role ||
            !account?.applications?.length
        ) {
            AppLogger.info(`[AccountProvider - editAccount] Missing mandatory fields`);
            return null;
        }

        await getPrismaClient().account.update({
            where: { id: account._id },
            data: {
                username: account.username,
                email: account.email,
                role: account.role,
                applications: account.applications ?? [],
            },
        });

        return { _id: account._id };
    } catch (error) {
        AppLogger.error(`[AccountProvider - editAccount] error: `, error);
        return null;
    }
};

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

        const exists = await getPrismaClient().account.findUnique({ where: { id: _id } });
        if (!exists) {
            return null;
        }

        await getPrismaClient().account.update({
            where: { id: _id },
            data: { password },
        });

        return { _id };
    } catch (error) {
        AppLogger.error(`[AccountProvider - updateAccountPassword] error: `, error);
        return null;
    }
};

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

        await getPrismaClient().account.delete({ where: { id: userToDelete._id } });

        AppLogger.info(`[AccountProvider - deleteAccount] deleted account: ${userToDelete._id}`);
        return { _id: userToDelete._id };
    } catch (error) {
        AppLogger.error(`[AccountProvider - deleteAccount] error: `, error);
        return null;
    }
};

const getAccountDetailsByParams = async ({ _id, email }: { _id?: number; email?: string }) => {
    try {
        AppLogger.info(
            `[AccountProvider - getAccountDetailsByParams] _id: ${_id}, email: ${email}`,
        );
        if (!_id && !email) {
            return null;
        }

        const account = await getPrismaClient().account.findFirst({
            where: _id ? { id: _id } : { email },
        });

        if (!account) {
            AppLogger.info(`[AccountProvider - getAccountDetailsByParams] account not found`);
            return null;
        }

        AppLogger.info(
            `[AccountProvider - getAccountDetailsByParams] account found: ${account.id}`,
        );

        return { ...account, _id: account.id };
    } catch (error) {
        AppLogger.error(`[AccountProvider - getAccountDetailsByParams] error: `, error);
        return null;
    }
};

const getAccountListByPageAndParams = async ({
    searchText = '',
    start = 0,
    limit = 10,
}: SearchQueryType) => {
    try {
        AppLogger.info(`[AccountProvider - getAccountListByPageAndParams] start: ${start}`);
        AppLogger.info(`[AccountProvider - getAccountListByPageAndParams] limit: ${limit}`);

        const accounts = await getPrismaClient().account.findMany({
            skip: start,
            take: limit,
            where: searchText
                ? {
                      OR: [
                          { username: { contains: searchText, mode: 'insensitive' } },
                          { email: { contains: searchText, mode: 'insensitive' } },
                      ],
                  }
                : undefined,
            orderBy: { username: 'asc' },
        });

        AppLogger.info(
            `[AccountProvider - getAccountListByPageAndParams] accountList: ${accounts?.length}`,
        );

        return accounts.map((a: (typeof accounts)[0]) => ({ ...a, _id: a.id }));
    } catch (error) {
        AppLogger.error(`[AccountProvider - getAccountListByPageAndParams] error:  ${error}`);
        return [];
    }
};

const getAccountNotificationSettings = async ({ _id }: { _id: number }) => {
    try {
        if (!_id) {
            return null;
        }

        const account = await getPrismaClient().account.findUnique({
            where: { id: _id },
            select: {
                id: true,
                auditReportEmailsEnabled: true,
                dailyDigestEmailsEnabled: true,
            },
        });

        if (!account) {
            return null;
        }

        return {
            _id: account.id,
            auditReportEmailsEnabled: account.auditReportEmailsEnabled,
            dailyDigestEmailsEnabled: account.dailyDigestEmailsEnabled,
        };
    } catch (error) {
        AppLogger.error(`[AccountProvider - getAccountNotificationSettings] error: `, error);
        return null;
    }
};

/**
 * Update the email notification preferences of a single account. An omitted flag
 * is left untouched, so the caller can toggle one preference without having to
 * resend the other.
 */
const updateAccountNotificationSettings = async ({
    _id,
    auditReportEmailsEnabled,
    dailyDigestEmailsEnabled,
}: { _id: number } & AccountNotificationSettingsInputType) => {
    try {
        if (!_id) {
            return null;
        }

        AppLogger.info(`[AccountProvider - updateAccountNotificationSettings] _id: ${_id}`);

        const updated = await getPrismaClient().account.update({
            where: { id: _id },
            data: {
                auditReportEmailsEnabled:
                    auditReportEmailsEnabled === undefined ? undefined : !!auditReportEmailsEnabled,
                dailyDigestEmailsEnabled:
                    dailyDigestEmailsEnabled === undefined ? undefined : !!dailyDigestEmailsEnabled,
            },
            select: {
                id: true,
                auditReportEmailsEnabled: true,
                dailyDigestEmailsEnabled: true,
            },
        });

        return {
            _id: updated.id,
            auditReportEmailsEnabled: updated.auditReportEmailsEnabled,
            dailyDigestEmailsEnabled: updated.dailyDigestEmailsEnabled,
        };
    } catch (error) {
        AppLogger.error(`[AccountProvider - updateAccountNotificationSettings] error: `, error);
        return null;
    }
};

/**
 * Every account that owns at least one application and still wants the daily
 * digest, with the applications the digest has to cover.
 *
 * Returns `null` — not an empty list — when the read fails, so the caller can
 * tell "nobody subscribed" from "the database was unreachable" and retry instead
 * of recording a digest run that reached no one.
 */
const getDailyDigestRecipients = async () => {
    try {
        const accounts = await getPrismaClient().account.findMany({
            where: {
                dailyDigestEmailsEnabled: true,
                ownedApplications: { some: {} },
            },
            select: {
                id: true,
                username: true,
                email: true,
                ownedApplications: { select: { id: true, name: true, acronym: true } },
            },
        });

        return accounts.map((account) => ({
            _id: account.id,
            username: account.username,
            email: account.email,
            applications: account.ownedApplications.map((application) => ({
                _id: application.id,
                name: application.name,
                acronym: application.acronym,
            })),
        }));
    } catch (error) {
        AppLogger.error(`[AccountProvider - getDailyDigestRecipients] error: `, error);
        return null;
    }
};

const AccountProvider = {
    createAccount,
    editAccount,
    updateAccountPassword,
    deleteAccount,
    getAccountDetailsByParams,
    getAccountListByPageAndParams,
    getAccountNotificationSettings,
    updateAccountNotificationSettings,
    getDailyDigestRecipients,
};

export default AccountProvider;
