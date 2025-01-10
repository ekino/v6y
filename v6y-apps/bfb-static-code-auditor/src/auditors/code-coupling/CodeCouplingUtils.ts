import { AppLogger, AuditType, auditStatus } from '@v6y/core-logic';
import Madge from 'madge';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';

/**
 * Default options for dependency analysis.
 */
const defaultOptions = {
    fileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    excludeRegExp: [
        /.*node_modules\/.*/,
        /.*target\/.*/,
        /.*dist\/.*/,
        /.*__mocks__\/.*/,
        /.*husky\/.*/,
        /.*vscode\/.*/,
        /.*idea\/.*/,
        /.*next\/.*/,
        /.*gitlab\/.*/,
        /.*github\/.*/,
        /.*eslint.*/,
        /.*jest.*/,
        /.*test.*/,
        /.*babel.*/,
        /.*webpack.*/,
        /.*\.config.*/,
        /.*\.types.*/,
        /.*\.svg/,
        /.*\.d\.ts.*/,
    ],
};

/**
 * Format code coupling reports.
 * @param application
 * @param workspaceFolder
 */
const formatCodeCouplingReports = async ({
    application,
    workspaceFolder,
}: AuditCommonsType): Promise<AuditType[] | null> => {
    try {
        AppLogger.info(
            `[CodeCouplingUtils - formatCodeCouplingReports] application:  ${application}`,
        );
        AppLogger.info(
            `[CodeCouplingUtils - formatCodeCouplingReports] workspaceFolder:  ${workspaceFolder}`,
        );

        if (!application || !workspaceFolder) {
            return [];
        }

        const dependenciesParseResult = await Madge(workspaceFolder, defaultOptions);
        AppLogger.info(
            `[CodeCouplingUtils - formatCodeCouplingReports] dependenciesParseResult:  ${dependenciesParseResult}`,
        );

        if (!dependenciesParseResult) {
            return null;
        }

        const dependenciesTree = dependenciesParseResult.obj();
        const circularGraph = dependenciesParseResult.circularGraph();
        AppLogger.info(
            `[CodeCouplingUtils - formatCodeCouplingReports] dependenciesTree:  ${dependenciesTree}`,
        );
        AppLogger.info(
            `[CodeCouplingUtils - formatCodeCouplingReports] circularGraph:  ${circularGraph}`,
        );

        if (!dependenciesTree || !circularGraph) {
            return null;
        }

        const auditReports = [];

        const analyzedBranch = workspaceFolder.split('/').pop();

        const module = {
            appId: application?._id,
            url: application?.repo?.webUrl,
            branch: analyzedBranch,
            path: '',
        };

        if (Object.keys(circularGraph || {}).length) {
            for (const circularDepSource of Object.keys(circularGraph)) {
                const circularDepDestinations = circularGraph[circularDepSource];
                // eslint-disable-next-line max-depth
                if (!circularDepDestinations?.length) {
                    continue;
                }

                auditReports.push({
                    type: 'Code-Coupling',
                    category: 'circular-dependencies',
                    status: auditStatus.error,
                    score: null,
                    scoreUnit: '',
                    module: {
                        ...module,
                        path: `${circularDepSource} -> [${circularDepDestinations.join(',')}]`,
                    },
                });
            }
        }

        const dependenciesCouplingReports = Object.keys(dependenciesTree || {}).map((file) => ({
            file: file,
            dependencies: dependenciesTree[file],
        }));

        if (!dependenciesCouplingReports?.length) {
            return auditReports;
        }

        for (const dependenciesCouplingReport of dependenciesCouplingReports) {
            const { file, dependencies: outgoingDependencies } = dependenciesCouplingReport;

            AppLogger.info(`[CodeCouplingUtils - formatCodeCouplingReports] file:  ${file}`);

            AppLogger.info(
                `[CodeCouplingUtils - formatCodeCouplingReports] outgoingDependencies:  ${outgoingDependencies?.length}`,
            );

            // Efferent Coupling (Ce): This is the number of classes in other packages that the classes in the package depend upon.
            // It’s an indicator of the package’s dependence on externalities.
            // In other words, it measures the outgoing dependencies.
            const efferentCoupling = outgoingDependencies?.length || 0;
            AppLogger.info(
                `[CodeCouplingUtils - formatCodeCouplingReports] efferentCoupling:  ${efferentCoupling}`,
            );
            auditReports.push({
                type: 'Code-Coupling',
                category: 'efferent-coupling',
                status: auditStatus.info,
                score: efferentCoupling,
                scoreUnit: '',
                module: {
                    ...module,
                    path: `${file} -> [${outgoingDependencies?.join(',') || ''}]`,
                },
            });

            // Afferent Coupling (Ca): This is the number of classes in other packages that depend upon classes within the package.
            // It’s an indicator of the package’s responsibility.
            // In other words, it measures the incoming dependencies.
            const incomingDependencies = dependenciesCouplingReports.filter(
                (item) => item.file !== file && item.dependencies?.includes(file),
            );

            const formattedIncomingDependencies = incomingDependencies?.map((item) => item.file);

            AppLogger.info(
                `[CodeCouplingUtils - formatCodeCouplingReports] incomingDependencies:  ${incomingDependencies?.length}`,
            );
            AppLogger.info(
                `[CodeCouplingUtils - formatCodeCouplingReports] formattedIncomingDependencies:  ${formattedIncomingDependencies?.length}`,
            );

            const afferentCoupling = incomingDependencies?.length || 0;
            AppLogger.info(
                `[CodeCouplingUtils - formatCodeCouplingReports] afferentCoupling:  ${afferentCoupling}`,
            );
            auditReports.push({
                type: 'Code-Coupling',
                category: 'afferent-coupling',
                status: auditStatus.info,
                score: afferentCoupling,
                scoreUnit: '',
                module: {
                    ...module,
                    path: `${file} -> [${formattedIncomingDependencies?.join(',') || ''}]`,
                },
            });

            // Afferent (CA) and Efferent (CE) coupling then Instability indicator:
            // Instability I = CE / (CE + CA)
            const instabilityIndex = (
                efferentCoupling / (efferentCoupling + afferentCoupling) || 0
            )?.toFixed(2);
            AppLogger.info(
                `[CodeCouplingUtils - formatCodeCouplingReports] instabilityIndex:  ${instabilityIndex}`,
            );
            const isInstabilityIndexError =
                (efferentCoupling >= 2 || afferentCoupling >= 2) &&
                parseFloat(instabilityIndex) > 0.5;
            auditReports.push({
                type: 'Code-Coupling',
                category: 'instability-index',
                status: isInstabilityIndexError ? auditStatus.error : auditStatus.info,
                score: parseFloat(instabilityIndex),
                scoreUnit: '',
                module: {
                    ...module,
                    path: file,
                },
            });
        }

        return auditReports;
    } catch (error) {
        AppLogger.info(`[CodeCouplingUtils - formatCodeCouplingReports] error:  ${error}`);
        return null;
    }
};

const CodeCouplingUtils = {
    formatCodeCouplingReports,
};

export default CodeCouplingUtils;
