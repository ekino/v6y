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

const buildKeywordEvolutionList = async () => {
    try {
        // *********************************************** Keywords Related To Dependencies ******************************************
        const dependencyList = await DependencyProvider.getDependencyListByPageAndParams({
            appId: undefined,
        });

        AppLogger.info(
            `[KeywordEvolutionManager - buildKeywordEvolutionList] dependencyList:  ${dependencyList?.length}`,
        );

        if (dependencyList?.length) {
            for (const dependency of dependencyList) {
                if (
                    !dependency.module ||
                    !dependency.status ||
                    dependency.status === dependencyStatus['up-to-date']
                ) {
                    continue;
                }

                // add evolution according to keyword
                await EvolutionProvider.createEvolution({
                    category: `${codeSmellTypes.Dependency}-${dependency.status}`,
                    module: {
                        ...dependency.module,
                        status: dependency.status,
                    },
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

                if (audit.status === auditStatus.success) {
                    continue;
                }

                // add evolution according to keyword
                await EvolutionProvider.createEvolution({
                    category: `${audit.type}-${audit.category}`,
                    module: {
                        ...audit.module,
                        status: audit.status,
                    },
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
