import {
    AppLogger,
    ApplicationProvider,
    ApplicationType,
    RepositoryApi,
    ZipUtils,
} from '@v6y/core-logic';

import ServerConfig from '../config/ServerConfig.ts';

const { getRepositoryDetails, getRepositoryBranches, prepareGitBranchZipConfig } = RepositoryApi;

const { currentConfig } = ServerConfig;
const { staticAuditorApiPath, dynamicAuditorApiPath, devopsAuditorApiPath } = currentConfig || {};
const ZIP_BASE_DIR = '../code-analysis-workspace';

interface BuildApplicationBranchParams {
    name: string;
}

interface BuildApplicationParams {
    applicationId?: number;
    workspaceFolder?: string;
    application?: ApplicationType;
    branch?: BuildApplicationBranchParams;
    branches?: BuildApplicationBranchParams[];
}

/**
 * Builds the application backend by branch.
 * @param applicationId
 * @param workspaceFolder
 */
const buildApplicationBackendByBranch = async ({
    applicationId,
    workspaceFolder,
}: BuildApplicationParams) => {
    try {
        AppLogger.info(
            '[ApplicationManager - buildApplicationFrontendByBranch] applicationId: ',
            applicationId,
        );
        AppLogger.info(
            '[ApplicationManager - buildApplicationFrontendByBranch] workspaceFolder: ',
            workspaceFolder,
        );
        return true;
    } catch (error) {
        AppLogger.info(`[ApplicationManager - buildApplicationBackendByBranch] error:  ${error}`);
        return false;
    }
};

/**
 * Builds the application frontend by branch.
 * @param applicationId
 * @param workspaceFolder
 */
const buildApplicationFrontendByBranch = async ({
    applicationId,
    workspaceFolder,
}: BuildApplicationParams) => {
    AppLogger.info(
        '[ApplicationManager - buildApplicationFrontendByBranch] applicationId: ',
        applicationId,
    );
    AppLogger.info(
        '[ApplicationManager - buildApplicationFrontendByBranch] workspaceFolder: ',
        workspaceFolder,
    );

    AppLogger.info(
        '[ApplicationManager - buildApplicationFrontendByBranch] staticAuditorApiPath: ',
        staticAuditorApiPath,
    );

    try {
        AppLogger.info(
            `[ApplicationManager - buildApplicationFrontendByBranch] Calling static auditor for applicationId: ${applicationId}`,
        );

        const response = await fetch(staticAuditorApiPath as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId, workspaceFolder }),
        });

        const result = await response.text();
        AppLogger.info(
            `[ApplicationManager - buildApplicationFrontendByBranch] Static auditor response status: ${response.status}`,
        );
        AppLogger.info(
            `[ApplicationManager - buildApplicationFrontendByBranch] Static auditor response: ${result}`,
        );

        if (!response.ok) {
            AppLogger.error(
                `[ApplicationManager - buildApplicationFrontendByBranch] Static auditor failed with status ${response.status}`,
            );
        }
    } catch (error) {
        AppLogger.error(
            `[ApplicationManager - buildApplicationFrontendByBranch - staticAuditor] error:  ${error}`,
        );
    }

    return true;
};

/**
 * Builds the application details by branch.
 * @param application
 * @param branch
 */
const buildApplicationDetailsByBranch = async ({ application, branch }: BuildApplicationParams) => {
    try {
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] application: ',
            application,
        );
        AppLogger.info('[ApplicationManager - buildApplicationDetailsByBranch] branch: ', branch);

        const { zipSourceUrl, zipDestinationDir, zipFileName, zipBaseFileName, zipOptions } =
            prepareGitBranchZipConfig({
                zipBaseDir: ZIP_BASE_DIR,
                application,
                branchName: branch?.name || '',
            }) || {};

        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] zipSourceUrl: ',
            zipSourceUrl,
        );
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] zipDestinationDir: ',
            zipDestinationDir,
        );
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] zipFileName: ',
            zipFileName,
        );
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] zipBaseFileName: ',
            zipBaseFileName,
        );

        if (!zipSourceUrl?.length || !zipDestinationDir?.length || !zipFileName?.length) {
            return false;
        }

        const zipDownloadStatus = await ZipUtils.downloadZip({
            zipSourceUrl,
            zipDestinationDir,
            zipFileName,
            zipOptions,
        });
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] zipDownloadStatus: ',
            zipDownloadStatus,
        );

        if (!zipDownloadStatus) {
            return false;
        }

        const workspaceFolder = await ZipUtils.unZipFile({
            zipOriginalSourceDir: zipDestinationDir,
            zipOriginalFileName: zipFileName,
            zipNewSourceDir: zipBaseFileName,
        });
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] workspaceFolder: ',
            workspaceFolder,
        );

        if (!workspaceFolder) {
            return false;
        }

        await buildApplicationFrontendByBranch({
            applicationId: application?._id,
            workspaceFolder,
        });

        await buildApplicationBackendByBranch({
            applicationId: application?._id,
            workspaceFolder,
        });

        ZipUtils.deleteZip({
            zipDirFullPath: zipDestinationDir,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[ApplicationManager - buildApplicationDetailsByBranch] error:  ${error}`);
        return false;
    }
};

/**
 * Builds the static reports.
 * @param application
 * @param branches
 */
const buildStaticReports = async ({ application, branches }: BuildApplicationParams) => {
    try {
        AppLogger.info('[ApplicationManager - buildStaticReports] branches: ', branches?.length);
        AppLogger.info('[ApplicationManager - buildStaticReports] application: ', application);

        if (!branches?.length || !application) {
            return false;
        }

        for (const branch of branches) {
            AppLogger.info('[ApplicationManager - buildStaticReports] branch: ', branch);

            await buildApplicationDetailsByBranch({
                application,
                branch,
            });
        }

        return true;
    } catch (error) {
        AppLogger.info(`[ApplicationManager - buildStaticReports] error:  ${error}`);
        return false;
    }
};

/**
 * Builds the dynamic reports.
 * @param application
 */
const buildDynamicReports = async ({ application }: BuildApplicationParams) => {
    AppLogger.info('[ApplicationManager - buildDynamicReports] application: ', application?._id);

    if (!application) {
        return false;
    }

    AppLogger.info(
        '[ApplicationManager - buildDynamicReports] dynamicAuditorApiPath: ',
        dynamicAuditorApiPath,
    );

    try {
        await fetch(dynamicAuditorApiPath as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                applicationId: application?._id,
                workspaceFolder: null,
            }),
        });
    } catch (error) {
        AppLogger.info(
            `[ApplicationManager - buildDynamicReports - dynamicAuditor] error:  ${error}`,
        );
    }

    try {
        await fetch(devopsAuditorApiPath as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                applicationId: application?._id,
            }),
        });
    } catch (error) {
        AppLogger.info(
            `[ApplicationManager - buildDynamicReports - devOpsAuditor] error:  ${error}`,
        );
    }

    return true;
};

/**
 * Validates application has required fields for analysis.
 * @param application
 */
const validateApplicationForAnalysis = (application: ApplicationType): boolean => {
    if (
        !application?.name?.length ||
        !application?.acronym?.length ||
        !application?.contactMail?.length ||
        !application?.description?.length ||
        !application?.repo?.organization?.length ||
        !application?.repo?.gitUrl?.length
    ) {
        AppLogger.error(
            `[ApplicationManager - buildApplicationReports] Application ${application?._id} missing required fields`,
        );
        AppLogger.error(
            `[ApplicationManager - buildApplicationReports] Fields: name=${!!application?.name?.length}, acronym=${!!application?.acronym?.length}, contactMail=${!!application?.contactMail?.length}, description=${!!application?.description?.length}, organization=${!!application?.repo?.organization?.length}, gitUrl=${!!application?.repo?.gitUrl?.length}`,
        );
        return false;
    }
    return true;
};

/**
 * Extracts repository name from git URL.
 * @param gitUrl
 */
const extractRepositoryName = (gitUrl: string): string | null => {
    const gitRepositoryName = gitUrl?.split('/')?.pop()?.replace('.git', '');
    if (!gitRepositoryName) {
        AppLogger.error(
            `[ApplicationManager - buildApplicationReports] Could not extract repository name from gitUrl: ${gitUrl}`,
        );
    }
    return gitRepositoryName;
};

/**
 * Handles repository access failure by running only dynamic analysis.
 * @param application
 */
const handleRepositoryAccessFailure = async (application: ApplicationType): Promise<boolean> => {
    AppLogger.info(
        `[ApplicationManager - buildApplicationDetailsByParams] Starting dynamic analysis for application: ${application?._id} (repository not accessible)`,
    );

    const dynamicResult = await buildDynamicReports({
        application,
    });

    if (!dynamicResult) {
        AppLogger.error(
            `[ApplicationManager - buildApplicationReports] Dynamic analysis failed for application: ${application?._id}`,
        );
    } else {
        AppLogger.info(
            `[ApplicationManager - buildApplicationReports] Dynamic analysis completed successfully for application: ${application?._id}`,
        );
    }

    return dynamicResult;
};

/**
 * Builds the application reports.
 * @param application
 */
const buildApplicationReports = async (application: ApplicationType) => {
    try {
        AppLogger.info(
            `[ApplicationManager - buildApplicationReports] Starting audit for application: ${application?._id} (${application?.name})`,
        );

        if (!validateApplicationForAnalysis(application)) {
            return false;
        }

        const { organization, gitUrl } = application.repo;
        const gitRepositoryName = extractRepositoryName(gitUrl);

        if (!gitRepositoryName) {
            return false;
        }

        AppLogger.info(
            `[ApplicationManager - buildApplicationReports] Fetching repository details for: ${organization}/${gitRepositoryName}`,
        );

        const repositoryDetails = await getRepositoryDetails({
            organization,
            gitRepositoryName,
        });

        if (!repositoryDetails?.id) {
            AppLogger.warn(
                `[ApplicationManager - buildApplicationReports] Repository not accessible: ${organization}/${gitRepositoryName}. This might be due to access permissions or network issues. Skipping static analysis but allowing dynamic analysis.`,
            );
            return await handleRepositoryAccessFailure(application);
        }

        if (repositoryDetails?.archived) {
            AppLogger.warn(
                `[ApplicationManager - buildApplicationReports] Repository is archived: ${organization}/${gitRepositoryName}`,
            );
            return false;
        }

        if (repositoryDetails?.empty_repo) {
            AppLogger.warn(
                `[ApplicationManager - buildApplicationReports] Repository is empty: ${organization}/${gitRepositoryName}`,
            );
            return false;
        }

        const { _links: repositoryLinks } = repositoryDetails;

        if (!repositoryLinks?.repo_branches) {
            AppLogger.error(
                `[ApplicationManager - buildApplicationReports] No branches URL found for repository: ${organization}/${gitRepositoryName}`,
            );
            return false;
        }

        AppLogger.info(
            `[ApplicationManager - buildApplicationReports] Fetching repository branches from: ${repositoryLinks.repo_branches}`,
        );

        const repositoryBranches = await getRepositoryBranches({
            repoBranchesUrl: repositoryLinks?.repo_branches,
        });

        if (!repositoryBranches?.length) {
            AppLogger.error(
                `[ApplicationManager - buildApplicationReports] No branches found for repository: ${organization}/${gitRepositoryName}`,
            );
            return false;
        }

        AppLogger.info(
            `[ApplicationManager - buildApplicationReports] Found ${repositoryBranches.length} branches: ${repositoryBranches.map((b) => b?.name).join(', ')}`,
        );

        // Update application with branch information
        const updateResult = await ApplicationProvider.editApplication({
            ...application,
            repo: {
                ...application?.repo,
                allBranches: repositoryBranches.map((branch) => branch?.name),
            },
        });

        if (!updateResult) {
            AppLogger.error(
                `[ApplicationManager - buildApplicationReports] Failed to update application ${application?._id} with branch information`,
            );
            return false;
        }

        AppLogger.info(
            `[ApplicationManager - buildApplicationReports] Starting static analysis for application: ${application?._id}`,
        );

        const staticResult = await buildStaticReports({
            application,
            branches: repositoryBranches,
        });

        if (!staticResult) {
            AppLogger.error(
                `[ApplicationManager - buildApplicationReports] Static analysis failed for application: ${application?._id}`,
            );
            // Continue with dynamic analysis even if static fails
        }

        AppLogger.info(
            `[ApplicationManager - buildApplicationReports] Starting dynamic analysis for application: ${application?._id}`,
        );

        const dynamicResult = await buildDynamicReports({
            application,
        });

        if (!dynamicResult) {
            AppLogger.error(
                `[ApplicationManager - buildApplicationReports] Dynamic analysis failed for application: ${application?._id}`,
            );
        }

        AppLogger.info(
            `[ApplicationManager - buildApplicationReports] Completed analysis for application: ${application?._id} - Static: ${staticResult}, Dynamic: ${dynamicResult}`,
        );

        // Return true if at least one analysis succeeded
        return staticResult || dynamicResult;
    } catch (error) {
        AppLogger.error(
            `[ApplicationManager - buildApplicationReports] error for application ${application?._id}:`,
            error,
        );
        return false;
    }
};

/**
 * Processes a single application and returns the result.
 * @param application
 */
const processApplication = async (application: ApplicationType): Promise<boolean> => {
    AppLogger.info(
        `[ApplicationManager - buildApplicationList] Processing application ${application?._id}: ${application?.name}`,
    );

    try {
        const result = await buildApplicationReports(application);
        if (result) {
            AppLogger.info(
                `[ApplicationManager - buildApplicationList] ✅ Successfully processed application ${application?._id}`,
            );
            return true;
        } else {
            AppLogger.error(
                `[ApplicationManager - buildApplicationList] ❌ Failed to process application ${application?._id}`,
            );
            return false;
        }
    } catch (appError) {
        AppLogger.error(
            `[ApplicationManager - buildApplicationList] ❌ Error processing application ${application?._id}:`,
            appError,
        );
        return false;
    }
};

/**
 * Builds the application list.
 */
const buildApplicationList = async () => {
    try {
        AppLogger.info(
            '[ApplicationManager - buildApplicationList] Starting to fetch applications...',
        );

        const applications = await ApplicationProvider.getApplicationListByPageAndParams(
            {},
            { role: 'ADMIN' },
        );

        AppLogger.info(
            `[ApplicationManager - buildApplicationList] Found ${applications?.length} applications to process`,
        );

        if (!applications?.length) {
            AppLogger.warn(
                '[ApplicationManager - buildApplicationList] No applications found to process',
            );
            return false;
        }

        let successCount = 0;
        let failureCount = 0;

        for (const application of applications) {
            const success = await processApplication(application);
            if (success) {
                successCount++;
            } else {
                failureCount++;
            }
        }

        AppLogger.info(
            `[ApplicationManager - buildApplicationList] Completed processing: ${successCount} successful, ${failureCount} failed out of ${applications.length} applications`,
        );

        // Return true if at least one application was processed successfully
        return successCount > 0;
    } catch (error) {
        AppLogger.error('[ApplicationManager - buildApplicationList] error: ', error);
        return false;
    }
};

/**
 * Builds application details by specific params (for triggered audits).
 * @param applicationId - The ID of the application to audit
 * @param branch - Optional specific branch to audit
 */
const buildApplicationDetailsByParams = async ({
    applicationId,
    branch,
}: {
    applicationId: number;
    branch?: { name: string };
}) => {
    try {
        AppLogger.info(
            `[ApplicationManager - buildApplicationDetailsByParams] applicationId: ${applicationId}, branch: ${branch?.name}`,
        );

        // Get application details
        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        AppLogger.info(
            `[ApplicationManager - buildApplicationDetailsByParams] application found: ${application?._id}`,
        );

        if (!application) {
            AppLogger.error(
                `[ApplicationManager - buildApplicationDetailsByParams] Application not found: ${applicationId}`,
            );
            return false;
        }

        // If specific branch is provided, audit only that branch
        if (branch?.name) {
            return await auditSpecificBranch(application, branch);
        }

        // Otherwise, run full audit
        return await auditFullApplication(application);
    } catch (error) {
        AppLogger.error(`[ApplicationManager - buildApplicationDetailsByParams] error: ${error}`);
        return false;
    }
};

/**
 * Audits a specific branch of an application.
 * @param application
 * @param branch
 */
const auditSpecificBranch = async (
    application: ApplicationType,
    branch: { name: string },
): Promise<boolean> => {
    AppLogger.info(
        `[ApplicationManager - buildApplicationDetailsByParams] Auditing specific branch: ${branch.name}`,
    );

    // Run static analysis for the specific branch
    const staticResult = await buildStaticReports({
        application,
        branches: [branch],
    });

    AppLogger.info(
        `[ApplicationManager - buildApplicationDetailsByParams] Static analysis result: ${staticResult}`,
    );

    // Run dynamic analysis
    const dynamicResult = await buildDynamicReports({
        application,
    });

    AppLogger.info(
        `[ApplicationManager - buildApplicationDetailsByParams] Dynamic analysis result: ${dynamicResult}`,
    );

    return true;
};

/**
 * Runs full audit for an application.
 * @param application
 */
const auditFullApplication = async (application: ApplicationType): Promise<boolean> => {
    AppLogger.info(`[ApplicationManager - buildApplicationDetailsByParams] Running full audit`);
    const result = await buildApplicationReports(application);
    AppLogger.info(
        `[ApplicationManager - buildApplicationDetailsByParams] Full audit result: ${result}`,
    );
    return result;
};

const ApplicationManager = {
    buildApplicationList,
    buildApplicationDetailsByParams,
};

export default ApplicationManager;
