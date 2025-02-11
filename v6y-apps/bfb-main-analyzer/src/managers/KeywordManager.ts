import { AppLogger, AuditProvider, KeywordProvider, auditStatus } from '@v6y/core-logic';

/**
 * Builds the keyword evolution list.
 */
const buildKeywordList = async () => {
    try {
        // *********************************************** Keywords Related To Audit ******************************************
        const auditList = await AuditProvider.getAuditListByPageAndParams({});

        AppLogger.info(
            `[KeywordEvolutionManager - buildKeywordList] auditList:  ${auditList?.length}`,
        );

        if (auditList?.length) {
            for (const audit of auditList) {
                // eslint-disable-next-line max-depth
                if (!audit.module || !audit.status || audit.status === auditStatus.info) {
                    continue;
                }

                // update keyword
                await KeywordProvider.createKeyword({
                    label: `${audit.type}-${audit.category}`,
                    module: {
                        ...audit.module,
                        status: audit.status,
                    },
                });
            }
        }

        return true;
    } catch (error) {
        AppLogger.info('[KeywordEvolutionManager - buildKeywordList] error: ', error);
        return false;
    }
};

const KeywordManager = {
    buildKeywordList,
};

export default KeywordManager;
