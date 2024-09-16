import { AppLogger, ApplicationProvider, DependencyProvider } from '@v6y/commons';

import DependenciesUtils from './DependenciesUtils.js';

const { formatDependenciesReports } = DependenciesUtils;

const startAuditorAnalysis = async ({ applicationId, workspaceFolder }) => {
    try {
        AppLogger.info(
            `[DependenciesAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[DependenciesAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );

        if (applicationId === undefined || !workspaceFolder?.length) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsByParams({
            appId: applicationId,
        });
        AppLogger.info(
            `[DependenciesAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        if (!application?._id) {
            return false;
        }

        AppLogger.info(
            `[DependenciesAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        const { organization, gitUrl } = application?.repo || {};
        AppLogger.info(
            `[DependenciesAuditor - startAuditorAnalysis] organization:  ${organization}`,
        );
        AppLogger.info(`[DependenciesAuditor - startAuditorAnalysis] gitUrl:  ${gitUrl}`);
        if (!organization?.length || !gitUrl?.length) {
            return false;
        }

        const gitRepositoryName = gitUrl?.split('/')?.pop()?.replace('.git', '');
        AppLogger.info(
            `[DependenciesAuditor - startAuditorAnalysis] gitRepositoryName:  ${gitRepositoryName}`,
        );
        if (!gitRepositoryName?.length) {
            return false;
        }

        const dependenciesReports = await formatDependenciesReports({
            application,
            workspaceFolder,
        });

        await DependencyProvider.insertDependencyList(dependenciesReports);

        AppLogger.info(
            `[DependenciesAuditor - startAuditorAnalysis] audit reports inserted successfully`,
        );

        return true;
    } catch (error) {
        AppLogger.error(
            '[DependenciesAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

const DependenciesAuditor = {
    startAuditorAnalysis,
};

export default DependenciesAuditor;
