import {
    AppLogger,
    ApplicationInputType,
    ApplicationProvider,
    SearchQueryType,
} from '@v6y/core-logic';

import ServerConfig from '../../config/ServerConfig.ts';

const { currentConfig } = ServerConfig;

/**
 * Trigger audit analysis via main-analyzer
 */
const triggerAuditAnalysis = async (
    applicationId: number,
    branch: string | undefined,
    analysisTypes: string[],
) => {
    try {
        const mainAnalyzerUrl = currentConfig?.mainAnalyzerApiPath;
        if (!mainAnalyzerUrl) {
            AppLogger.warn(
                '[AppMutations - triggerApplicationAnalysis] Missing mainAnalyzerApiPath configuration',
            );
            return;
        }
        await fetch(mainAnalyzerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId, branch, analysisTypes }),
        });
    } catch (err) {
        AppLogger.warn(`[AppMutations - triggerApplicationAnalysis] Main analyzer error: ${err}`);
    }
};

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
 * Trigger application analysis
 * @param _
 * @param params
 */
const triggerApplicationAnalysis = async (
    _: unknown,
    params: {
        input: {
            applicationId: number;
            branch?: string;
            analysisTypes: string[];
        };
    },
) => {
    try {
        const { applicationId, branch, analysisTypes } = params?.input || {};

        if (!applicationId || !analysisTypes || analysisTypes.length === 0) {
            AppLogger.error(
                '[AppMutations - triggerApplicationAnalysis] Missing required parameters',
            );
            return {
                success: false,
                message: 'Missing applicationId or analysisTypes',
                applicationId,
                branch,
                auditRun: null,
            };
        }

        AppLogger.info(
            `[AppMutations - triggerApplicationAnalysis] applicationId: ${applicationId}, branch: ${branch}, analysisTypes: ${analysisTypes.join(',')}`,
        );

        // Verify application exists
        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        if (!application) {
            AppLogger.error(
                `[AppMutations - triggerApplicationAnalysis] Application not found: ${applicationId}`,
            );
            return {
                success: false,
                message: 'Application not found',
                applicationId,
                branch,
                auditRun: null,
            };
        }

        AppLogger.info(
            `[AppMutations - triggerApplicationAnalysis] applicationId: ${applicationId}, branch: ${branch}, analysisTypes: ${analysisTypes.join(',')}`,
        );

        // Trigger async analysis job via main-analyzer
        (async () => {
            try {
                AppLogger.info(
                    `[AppMutations - triggerApplicationAnalysis] Triggering main-analyzer for app ${applicationId}`,
                );
                await triggerAuditAnalysis(applicationId, branch, analysisTypes);
            } catch (asyncError) {
                AppLogger.error(
                    `[AppMutations - triggerApplicationAnalysis] Async analysis job error: ${asyncError}`,
                );
            }
        })();

        return {
            success: true,
            message: 'Analysis triggered successfully',
            applicationId,
            branch,
            auditRun: null,
        };
    } catch (error) {
        AppLogger.error(`[AppMutations - triggerApplicationAnalysis] error: ${error}`);

        return {
            success: false,
            message: `Error triggering analysis: ${error}`,
            applicationId: params?.input?.applicationId,
            branch: params?.input?.branch,
            auditRun: null,
        };
    }
};

const ApplicationMutations = {
    createOrEditApplication,
    deleteApplication,
    triggerApplicationAnalysis,
};

export default ApplicationMutations;
