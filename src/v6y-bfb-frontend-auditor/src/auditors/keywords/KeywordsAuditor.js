import { AppLogger } from '@v6y/commons';

const startAuditorAnalysis = async ({ applicationId, workspaceFolder }) => {
    try {
        AppLogger.info(`[KeywordsAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`);
        AppLogger.info(
            `[KeywordsAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );

        // get list deps by appId => keyword for deprecated and outdated deps
        // get list audits by appId => keyword for bad score / bad pattern

        return true;
    } catch (error) {
        AppLogger.error(
            '[KeywordsAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

const KeywordsAuditor = {
    startAuditorAnalysis,
};

export default KeywordsAuditor;
