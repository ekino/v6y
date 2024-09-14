import { AppLogger, ApplicationProvider } from '@v6y/commons';

const startAuditorAnalysis = async ({ applicationId, workspaceFolder }) => {
    try {
        AppLogger.info(
            `[DependenciesAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[DependenciesAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );

        if (!applicationId?.length || !workspaceFolder?.length) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsByParams({
            appId: applicationId,
        });

        if (!application?._id) {
            return false;
        }

        AppLogger.info(
            `[DependenciesAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
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
