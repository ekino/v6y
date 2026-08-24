import {
    AccountType,
    AppLogger,
    ApplicationInputType,
    ApplicationProvider,
    SearchQueryType,
} from '@v6y/core-logic';

/**
 * Header carrying the shared secret used by the analyzer services to
 * authenticate calls coming from the BFF. Omitted when unset, in which case the
 * analyzer accepts the call as before.
 */
const buildInternalApiHeaders = () => {
    const internalSecret = process.env.V6Y_INTERNAL_API_SECRET;

    return {
        'Content-Type': 'application/json',
        ...(internalSecret?.length ? { 'x-v6y-internal-secret': internalSecret } : {}),
    };
};

/**
 * Create or update the recurring application analysis schedule on the main
 * analyzer, based on the application's audit reporting frequency. Failures are
 * logged and reported back to the caller but never thrown, so a
 * main-analyzer/queue hiccup never blocks saving the application itself.
 *
 * Returns whether the analyzer confirmed the change. A `false` here means the
 * database and the analyzer's schedulers are temporarily out of sync; the
 * analyzer's own reconciliation (boot + daily) re-applies every enabled
 * schedule from the database, so the divergence is transient rather than
 * permanent — but the caller still gets to say so instead of reporting a clean
 * success.
 * @param applicationId
 * @param cron
 * @param enabled
 */
const scheduleApplicationAnalysis = async (
    applicationId: number,
    cron: string | null | undefined,
    enabled: boolean | undefined,
): Promise<boolean> => {
    try {
        const scheduleUrl = process.env.V6Y_MAIN_ANALYZER_SCHEDULE_API_PATH;

        if (!scheduleUrl?.length) {
            AppLogger.error(
                `[AppMutations - scheduleApplicationAnalysis] V6Y_MAIN_ANALYZER_SCHEDULE_API_PATH is not configured, the audit schedule for applicationId=${applicationId} was not applied.`,
            );
            return false;
        }

        AppLogger.info(
            `[AppMutations - scheduleApplicationAnalysis] applicationId : ${applicationId}, enabled : ${enabled}, cron : ${cron}`,
        );

        const response = await fetch(scheduleUrl, {
            method: 'POST',
            headers: buildInternalApiHeaders(),
            body: JSON.stringify({ applicationId, cron, enabled: !!enabled }),
        });

        if (!response.ok) {
            const responseBody = (await response.json().catch(() => null)) as {
                message?: string;
            } | null;
            AppLogger.error(
                `[AppMutations - scheduleApplicationAnalysis] Unable to update the audit schedule for applicationId=${applicationId}: ${responseBody?.message || response.status}`,
            );
            return false;
        }

        return true;
    } catch (error) {
        AppLogger.error(
            `[AppMutations - scheduleApplicationAnalysis] An exception occurred while updating the audit schedule for applicationId=${applicationId}: `,
            error,
        );
        return false;
    }
};

/**
 * Create or edit application
 * @param _
 * @param params
 * @param context
 */
const createOrEditApplication = async (
    _: unknown,
    params: { applicationInput: ApplicationInputType },
    context?: { user?: AccountType },
) => {
    try {
        const {
            _id,
            acronym,
            name,
            description,
            gitOrganization,
            gitUrl,
            gitWebUrl,
            productionLink,
            dataDogApiKey,
            dataDogAppKey,
            dataDogUrl,
            dataDogMonitorId,
            contactMail,
            sonarqubeLink,
            sonarqubeToken,
            codeQualityPlatformLink,
            ciPlatformLink,
            deploymentPlatformLink,
            auditFrequencyEnabled,
            auditFrequencyCron,
            ownerId,
        } = params?.applicationInput || {};

        // An application always belongs to somebody: it is the addressee of the
        // audit notification emails. Whoever creates it owns it unless an owner
        // was named explicitly.
        const applicationOwnerId = ownerId || context?.user?._id;

        AppLogger.info(`[AppMutations - createOrEditApplication] _id : ${_id}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] acronym : ${acronym}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] name : ${name}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] description : ${description}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] gitUrl : ${gitUrl}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] gitWebUrl : ${gitWebUrl}`);
        AppLogger.info(
            `[AppMutations - createOrEditApplication] gitOrganization : ${gitOrganization}`,
        );
        AppLogger.info(
            `[AppMutations - createOrEditApplication] dataDogApiKey : ${dataDogApiKey ? '"********"' : 'null'}`,
        );
        AppLogger.info(
            `[AppMutations - createOrEditApplication] dataDogAppKey : ${dataDogAppKey ? '"********"' : 'null'}`,
        );
        AppLogger.info(`[AppMutations - createOrEditApplication] dataDogUrl : ${dataDogUrl}`);
        AppLogger.info(
            `[AppMutations - createOrEditApplication] dataDogMonitorId : ${dataDogMonitorId}`,
        );

        AppLogger.info(
            `[AppMutations - createOrEditApplication] productionLink : ${productionLink}`,
        );
        AppLogger.info(`[AppMutations - createOrEditApplication] contactMail : ${contactMail}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] sonarqubeLink : ${sonarqubeLink}`);
        AppLogger.info(
            `[AppMutations - createOrEditApplication] sonarqubeToken : ${sonarqubeToken ? '"********"' : 'null'}`,
        );
        AppLogger.info(
            `[AppMutations - createOrEditApplication] codeQualityPlatformLink : ${codeQualityPlatformLink}`,
        );

        if (_id) {
            const editedApplication = await ApplicationProvider.editFormApplication({
                _id,
                acronym,
                name,
                description,
                gitOrganization,
                gitUrl,
                gitWebUrl,
                productionLink,
                contactMail,
                sonarqubeLink,
                sonarqubeToken,
                codeQualityPlatformLink,
                ciPlatformLink,
                deploymentPlatformLink,
                dataDogApiKey,
                dataDogAppKey,
                dataDogUrl,
                dataDogMonitorId,
                auditFrequencyEnabled,
                auditFrequencyCron,
                ownerId: applicationOwnerId,
            } as ApplicationInputType);

            AppLogger.info(
                `[AppMutations - createOrEditApplication] editedApplication : ${editedApplication?._id}`,
            );

            if (!editedApplication?._id) {
                return editedApplication;
            }

            const editedScheduleApplied = await scheduleApplicationAnalysis(
                editedApplication._id,
                auditFrequencyCron,
                auditFrequencyEnabled,
            );

            return { ...editedApplication, auditFrequencyScheduled: editedScheduleApplied };
        }

        if (!applicationOwnerId) {
            throw new Error('An owner account is required to create an application');
        }

        const createdApplication = await ApplicationProvider.createFormApplication({
            acronym,
            name,
            description,
            gitOrganization,
            gitUrl,
            gitWebUrl,
            productionLink,
            contactMail,
            sonarqubeLink,
            sonarqubeToken,
            codeQualityPlatformLink,
            ciPlatformLink,
            deploymentPlatformLink,
            dataDogApiKey,
            dataDogAppKey,
            dataDogUrl,
            dataDogMonitorId,
            auditFrequencyEnabled,
            auditFrequencyCron,
            ownerId: applicationOwnerId,
        } as ApplicationInputType);

        AppLogger.info(
            `[AppMutations - createOrEditApplication] createdApplication : ${createdApplication?._id}`,
        );

        if (!createdApplication?._id) {
            return createdApplication;
        }

        const createdScheduleApplied = await scheduleApplicationAnalysis(
            createdApplication._id,
            auditFrequencyCron,
            auditFrequencyEnabled,
        );

        return { ...createdApplication, auditFrequencyScheduled: createdScheduleApplied };
    } catch (error) {
        AppLogger.info(`[AppMutations - createOrEditApplication] error : ${error}`);
        return null;
    }
};

/**
 * Delete application
 * @param _
 * @param params
 */
const deleteApplication = async (_: unknown, params: { input: SearchQueryType }) => {
    try {
        const whereClause = params?.input;
        if (!whereClause) {
            return null;
        }

        const appId = whereClause.id;
        if (!appId) {
            return null;
        }

        AppLogger.info(`[AppMutations - deleteApplication] appId : ${appId}`);

        const applicationId = parseInt(appId, 10);

        // Unschedule before the row is gone: a job scheduler left behind in Redis
        // keeps enqueuing analyses (hourly for the densest preset) for an
        // application the analyzer can no longer find.
        await scheduleApplicationAnalysis(applicationId, null, false);

        await ApplicationProvider.deleteApplication({ _id: applicationId });

        return {
            _id: appId,
        };
    } catch (error) {
        AppLogger.info(`[AppMutations - deleteApplication] error : ${error}`);
        return null;
    }
};

/**
 * Trigger application analysis asynchronously.
 * @param _
 * @param params
 * @param user
 */
const triggerApplicationAnalysis = async (
    _: unknown,
    params: { applicationId: number },
    { user }: { user: AccountType },
) => {
    try {
        const { applicationId } = params || {};

        if (!applicationId) {
            throw new Error('The applicationId is required');
        }

        if (!(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(applicationId)) {
                throw new Error('Unauthorized');
            }
        }

        const triggerUrl = process.env.V6Y_MAIN_ANALYZER_TRIGGER_API_PATH;

        if (!triggerUrl?.length) {
            throw new Error('The main analyzer trigger API path is not configured');
        }

        AppLogger.info(
            `[AppMutations - triggerApplicationAnalysis] applicationId : ${applicationId}`,
        );

        const response = await fetch(triggerUrl, {
            method: 'POST',
            headers: buildInternalApiHeaders(),
            body: JSON.stringify({ applicationId }),
        });

        const responseBody = (await response.json().catch(() => null)) as {
            success?: boolean;
            message?: string;
            applicationId?: number;
        } | null;

        if (!response.ok || !responseBody?.success) {
            throw new Error(
                responseBody?.message || `Unable to trigger the analysis (HTTP ${response.status})`,
            );
        }

        return {
            success: true,
            message: responseBody.message || 'Analysis triggered successfully',
            applicationId: responseBody.applicationId || applicationId,
        };
    } catch (error) {
        AppLogger.info(`[AppMutations - triggerApplicationAnalysis] error : ${error}`);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to trigger analysis',
            applicationId: params?.applicationId || 0,
        };
    }
};

const ApplicationMutations = {
    createOrEditApplication,
    deleteApplication,
    triggerApplicationAnalysis,
};

export default ApplicationMutations;
