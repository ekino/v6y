import {
    AppLogger,
    AuditProvider,
    DependencyProvider,
    EvolutionProvider,
    KeywordProvider,
} from '@v6y/commons';
import { auditStatus } from '@v6y/commons/src/config/AuditHelpConfig.js';
import { codeSmellTypes } from '@v6y/commons/src/config/CodeSmellConfig.js';
import { dependencyStatus } from '@v6y/commons/src/config/DependencyStatusHelpConfig.js';
import { keywordStatus } from '@v6y/commons/src/config/KeywordStatusConfig.js';

const buildKeywordEvolutionList = async () => {
    try {
        // *********************************************** Keywords Related To Dependencies ******************************************

        const dependencyList = await DependencyProvider.getDependencyListByPageAndParams({
            appId: undefined,
            fullReport: false,
        });

        AppLogger.info(
            `[KeywordEvolutionManager - buildKeywordEvolutionList] dependencyList:  ${dependencyList?.length}`,
        );

        if (dependencyList?.length) {
            for (const dependency of dependencyList) {
                if (!dependency.status || dependency.status === dependencyStatus['up-to-date']) {
                    continue;
                }

                const keyword = {
                    label: dependency.name,
                    status:
                        dependency.status === dependencyStatus['outdated']
                            ? keywordStatus.warning
                            : keywordStatus.error,
                    version: dependency.version,
                    module: dependency.module,
                };

                // update keyword
                await KeywordProvider.createKeyword(keyword);

                // add evolution according to keyword
                await EvolutionProvider.createEvolution({
                    type: codeSmellTypes.Dependency,
                    category: dependency.status,
                    module: dependency.module,
                });
            }
        }

        // *********************************************** Keywords Related To Audit ******************************************

        const auditList = await AuditProvider.getAuditListByPageAndParams({
            appId: undefined,
            fullReport: false,
        });

        AppLogger.info(
            `[KeywordEvolutionManager - buildKeywordEvolutionList] auditList:  ${auditList?.length}`,
        );

        if (auditList?.length) {
            for (const audit of auditList) {
                if (
                    !audit.status ||
                    audit.status === auditStatus.info ||
                    audit.status === auditStatus.success
                ) {
                    continue;
                }

                const keyword = {
                    label: `${audit.type}-${audit.category}`,
                    status: audit.status,
                    version: `${audit.score || 0} ${audit.scoreUnit || ''}`,
                    module: audit.module,
                };

                // update keyword
                await KeywordProvider.createKeyword(keyword);

                // add evolution according to keyword
                await EvolutionProvider.createEvolution({
                    type: audit.type,
                    category: audit.category,
                    module: audit.module,
                });
            }
        }

        return true;
    } catch (error) {
        AppLogger.info('[KeywordEvolutionManager - buildKeywordEvolutionList] error: ', error);
        return false;
    }
};

const KeywordEvolutionManager = {
    buildKeywordEvolutionList,
};

export default KeywordEvolutionManager;
