import {
    AppLogger,
    AuditProvider,
    DependencyProvider,
    EvolutionProvider,
    auditStatus,
    dependencyStatus,
    scoreStatus,
} from '@v6y/core-logic';

/**
 * Builds the Evolution list.
 */
const buildEvolutionList = async () => {
    try {
        // *********************************************** Evolutions Related To Dependencies ******************************************
        const dependencyList = await DependencyProvider.getDependencyListByPageAndParams({
            appId: undefined,
        });

        AppLogger.info(
            `[EvolutionManager - buildEvolutionList] dependencyList:  ${dependencyList?.length}`,
        );

        if (dependencyList?.length) {
            for (const dependency of dependencyList) {
                // eslint-disable-next-line max-depth
                if (
                    !dependency.module ||
                    !dependency.status ||
                    dependency.status === dependencyStatus['up-to-date']
                ) {
                    continue;
                }

                // add evolution according to Evolution
                await EvolutionProvider.createEvolution({
                    category: `Dependency-${dependency.status}`,
                    module: {
                        ...dependency.module,
                        status: dependency.status,
                    },
                });
            }
        }

        // *********************************************** Evolutions Related To Audit ******************************************

        const auditList = await AuditProvider.getAuditListByPageAndParams({});

        AppLogger.info(`[EvolutionManager - buildEvolutionList] auditList:  ${auditList?.length}`);

        if (auditList?.length) {
            for (const audit of auditList) {
                // eslint-disable-next-line max-depth
                if (
                    !audit.module ||
                    audit.auditStatus === auditStatus.failure ||
                    !audit.scoreStatus ||
                    audit.scoreStatus === scoreStatus.info ||
                    audit.scoreStatus === scoreStatus.success
                ) {
                    continue;
                }

                // add evolution according to Evolution
                await EvolutionProvider.createEvolution({
                    category: `${audit.type}-${audit.category}`,
                    module: {
                        ...audit.module,
                        status: audit.scoreStatus,
                    },
                });
            }
        }

        return true;
    } catch (error) {
        AppLogger.info('[EvolutionManager - buildEvolutionList] error: ', error);
        return false;
    }
};

const EvolutionManager = {
    buildEvolutionList,
};

export default EvolutionManager;
