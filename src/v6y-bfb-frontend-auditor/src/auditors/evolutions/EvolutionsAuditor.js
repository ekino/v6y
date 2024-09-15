import { AppLogger } from '@v6y/commons';

const startAuditorAnalysis = async ({ applicationId, workspaceFolder }) => {
    try {
        AppLogger.info(
            `[EvolutionsAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[EvolutionsAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );

        // get list deps by appId => evolution for deprecated and outdated deps
        // get list audits by appId => evolution for bad score / bad pattern

        return true;
    } catch (error) {
        AppLogger.error(
            '[EvolutionsAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

const EvolutionsAuditor = {
    startAuditorAnalysis,
};

export default EvolutionsAuditor;
