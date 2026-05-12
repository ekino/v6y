import {
    AppLogger,
    ApplicationInputType,
    ApplicationProvider,
    AuditRunProvider,
    SearchQueryType,
} from '@v6y/core-logic';

/**
 * Trigger static auditor for application
 */
const triggerStaticAuditor = async (applicationId: number, auditRunId: string) => {
    try {
        const staticAuditorUrl =
            process.env.V6Y_STATIC_AUDITOR_API_PATH || 'http://bfb-static-auditor:3001/audits';
        await fetch(staticAuditorUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId, auditRunId }),
        });
    } catch (err) {
        AppLogger.warn(`[AppMutations - triggerApplicationAnalysis] Static auditor error: ${err}`);
    }
};

/**
 * Trigger dynamic auditor for application
 */
const triggerDynamicAuditor = async (applicationId: number, auditRunId: string) => {
    try {
        const dynamicAuditorUrl =
            process.env.V6Y_DYNAMIC_AUDITOR_API_PATH || 'http://bfb-dynamic-auditor:3002/audits';
        await fetch(dynamicAuditorUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId, auditRunId, workspaceFolder: null }),
        });
    } catch (err) {
        AppLogger.warn(`[AppMutations - triggerApplicationAnalysis] Dynamic auditor error: ${err}`);
    }
};

/**
 * Trigger devops auditor for application
 */
const triggerDevopsAuditor = async (applicationId: number, auditRunId: string) => {
    try {
        const devopsAuditorUrl =
            process.env.V6Y_DEVOPS_AUDITOR_API_PATH || 'http://bfb-devops-auditor:3003/audits';
        await fetch(devopsAuditorUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId, auditRunId }),
        });
    } catch (err) {
        AppLogger.warn(`[AppMutations - triggerApplicationAnalysis] DevOps auditor error: ${err}`);
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
    let auditRunId: string | undefined;

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

        // Create audit run record
        const auditRun = await AuditRunProvider.createAuditRun({
            appId: applicationId,
            branch: branch || null,
            runStatus: 'pending',
            analysisTypes,
        });

        if (!auditRun) {
            AppLogger.error(
                '[AppMutations - triggerApplicationAnalysis] Failed to create audit run',
            );
            return {
                success: false,
                message: 'Failed to create audit run',
                applicationId,
                branch,
                auditRun: null,
            };
        }

        auditRunId = auditRun._id;
        AppLogger.info(
            `[AppMutations - triggerApplicationAnalysis] Audit run created: ${auditRunId}`,
        );

        // Update status to in_progress
        await AuditRunProvider.updateAuditRunStatus({
            auditRunId,
            runStatus: 'in_progress',
        });

        // Trigger async analysis job via API calls
        (async () => {
            try {
                const branchesToAnalyze = branch
                    ? [{ name: branch }]
                    : application?.repo?.allBranches?.map((b: string) => ({ name: b })) || [];

                // Trigger static auditor if included
                if (analysisTypes.includes('static') && branchesToAnalyze.length > 0) {
                    AppLogger.info(
                        `[AppMutations - triggerApplicationAnalysis] Triggering static auditor for app ${applicationId}`,
                    );
                    await triggerStaticAuditor(applicationId, auditRunId);
                }

                // Trigger dynamic auditor if included
                if (analysisTypes.includes('dynamic')) {
                    AppLogger.info(
                        `[AppMutations - triggerApplicationAnalysis] Triggering dynamic auditor for app ${applicationId}`,
                    );
                    await triggerDynamicAuditor(applicationId, auditRunId);
                }

                // Trigger devops auditor if included
                if (analysisTypes.includes('devops')) {
                    AppLogger.info(
                        `[AppMutations - triggerApplicationAnalysis] Triggering devops auditor for app ${applicationId}`,
                    );
                    await triggerDevopsAuditor(applicationId, auditRunId);
                }
            } catch (asyncError) {
                AppLogger.error(
                    `[AppMutations - triggerApplicationAnalysis] Async analysis job error: ${asyncError}`,
                );
                await AuditRunProvider.updateAuditRunStatus({
                    auditRunId: auditRunId!,
                    runStatus: 'error',
                    errorMessage: String(asyncError),
                }).catch((updateErr) =>
                    AppLogger.warn(
                        `[AppMutations - triggerApplicationAnalysis] Failed to update error status: ${updateErr}`,
                    ),
                );
            }
        })();

        return {
            success: true,
            message: 'Analysis triggered successfully',
            applicationId,
            branch,
            auditRun,
        };
    } catch (error) {
        AppLogger.error(`[AppMutations - triggerApplicationAnalysis] error: ${error}`);

        // Try to update run status to error if it was created
        if (auditRunId) {
            await AuditRunProvider.updateAuditRunStatus({
                auditRunId,
                runStatus: 'error',
                errorMessage: String(error),
            }).catch((updateErr) =>
                AppLogger.warn(
                    `[AppMutations - triggerApplicationAnalysis] Failed to update error status: ${updateErr}`,
                ),
            );
        }

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
