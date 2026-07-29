import { AccountType, AiSummaryReportProvider, AppLogger } from '@v6y/core-logic';

/**
 * Get the application's cached AI summary report (a generic overview of the
 * application, not tied to any specific audit run or report), if one has
 * ever been generated.
 * @param _
 * @param args
 * @param user
 */
const getApplicationAiSummaryByParams = async (
    _: unknown,
    args: { _id: number },
    { user }: { user: AccountType },
) => {
    try {
        const { _id } = args || {};

        if (!_id) {
            return null;
        }

        if (!(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(_id)) {
                throw new Error('Unauthorized');
            }
        }

        AppLogger.info(`[AiSummaryQueries - getApplicationAiSummaryByParams] _id : ${_id}`);

        return AiSummaryReportProvider.getByAppId(_id);
    } catch (error) {
        AppLogger.error(`[AiSummaryQueries - getApplicationAiSummaryByParams] error : ${error}`);
        return null;
    }
};

const AiSummaryQueries = {
    getApplicationAiSummaryByParams,
};

export default AiSummaryQueries;
