import {
    AccountType,
    AppLogger,
    ApplicationInputType,
    ApplicationProvider,
    SearchQueryType,
} from '@v6y/core-logic';

/**
 * Create or edit application
 * @param _
 * @param params
 */
const createOrEditApplication = async (
    _: unknown,
    params: { applicationInput: ApplicationInputType },
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
            additionalProductionLinks,
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
        } = params?.applicationInput || {};

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
            `[AppMutations - createOrEditApplication] dataDogApiKey : ${dataDogApiKey ? '"********"}`,' : 'null'}`,
        );
        AppLogger.info(
            `[AppMutations - createOrEditApplication] dataDogAppKey : ${dataDogAppKey ? '"********"}`,' : 'null'}`,
        );
        AppLogger.info(`[AppMutations - createOrEditApplication] dataDogUrl : ${dataDogUrl}`);
        AppLogger.info(
            `[AppMutations - createOrEditApplication] dataDogMonitorId : ${dataDogMonitorId}`,
        );

        AppLogger.info(
            `[AppMutations - createOrEditApplication] productionLink : ${productionLink}`,
        );
        AppLogger.info(`[AppMutations - createOrEditApplication] contactMail : ${contactMail}`);
        AppLogger.info(
            `[AppMutations - createOrEditApplication] additionalProductionLinks : ${additionalProductionLinks?.join(
                ',',
            )}`,
        );
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
                additionalProductionLinks,
                dataDogApiKey,
                dataDogAppKey,
                dataDogUrl,
                dataDogMonitorId,
            } as ApplicationInputType);

            AppLogger.info(
                `[AppMutations - createOrEditApplication] editedApplication : ${editedApplication?._id}`,
            );

            return editedApplication;
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
            additionalProductionLinks,
            dataDogApiKey,
            dataDogAppKey,
            dataDogUrl,
            dataDogMonitorId,
        } as ApplicationInputType);

        AppLogger.info(
            `[AppMutations - createOrEditApplication] createdApplication : ${createdApplication?._id}`,
        );

        return createdApplication;
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

        await ApplicationProvider.deleteApplication({ _id: parseInt(appId, 10) });

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
            headers: { 'Content-Type': 'application/json' },
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
