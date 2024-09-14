import { AppLogger } from '@v6y/commons';
import { auditStatus } from '@v6y/commons/src/config/AuditHelpConfig.js';

/**
 * Formats coupling reports based on dependency analysis.
 *
 * @param {Object} options - The options object containing data for generating coupling reports.
 * @param {Object} options.application - The application object containing metadata (e.g., ID, repository URL).
 * @param {string} options.workspaceFolder - The path to the workspace folder being analyzed.
 * @param {Object} options.dependenciesTree - A tree structure representing dependencies between files.
 * @param {boolean} options.circular - Indicates if circular dependencies were found.
 * @param {Object} options.circularGraph - A graph representing circular dependencies.
 * @returns {Array} An array of audit reports containing coupling metrics and details.
 */
const formatCouplingReports = ({
    application,
    workspaceFolder,
    dependenciesTree,
    circular,
    circularGraph,
}) => {
    try {
        AppLogger.info(`[CodeCouplingUtils - formatCouplingReports] application:  ${application}`);
        AppLogger.info(
            `[CodeCouplingUtils - formatCouplingReports] workspaceFolder:  ${workspaceFolder}`,
        );
        AppLogger.info(`[CodeCouplingUtils - formatCouplingReports] circular:  ${circular}`);
        AppLogger.info(
            `[CodeCouplingUtils - formatCouplingReports] circularGraph:  ${circularGraph}`,
        );
        AppLogger.info(
            `[CodeCouplingUtils - formatCouplingReports] dependenciesTree:  ${dependenciesTree}`,
        );

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

                if (!circularDepDestinations?.length) {
                    continue;
                }

                auditReports.push({
                    type: 'Code-Coupling',
                    category: 'circular-dependencies',
                    status: auditStatus.error,
                    score: null,
                    scorePercent: null,
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
            AppLogger.info(`[CodeCouplingUtils - formatCouplingReports] file:  ${file}`);
            AppLogger.info(
                `[CodeCouplingUtils - formatCouplingReports] outgoingDependencies:  ${outgoingDependencies?.length}`,
            );

            // Efferent Coupling (Ce): This is the number of classes in other packages that the classes in the package depend upon.
            // It’s an indicator of the package’s dependence on externalities.
            // In other words, it measures the outgoing dependencies.
            const efferentCoupling = outgoingDependencies?.length || 0;
            AppLogger.info(
                `[CodeCouplingUtils - formatCouplingReports] efferentCoupling:  ${efferentCoupling}`,
            );
            auditReports.push({
                type: 'Code-Coupling',
                category: 'efferent-coupling',
                status: auditStatus.info,
                score: efferentCoupling,
                scorePercent: null,
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
                `[CodeCouplingUtils - formatCouplingReports] incomingDependencies:  ${incomingDependencies?.length}`,
            );
            AppLogger.info(
                `[CodeCouplingUtils - formatCouplingReports] formattedIncomingDependencies:  ${formattedIncomingDependencies?.length}`,
            );

            const afferentCoupling = incomingDependencies?.length || 0;
            AppLogger.info(
                `[CodeCouplingUtils - formatCouplingReports] afferentCoupling:  ${afferentCoupling}`,
            );
            auditReports.push({
                type: 'Code-Coupling',
                category: 'afferent-coupling',
                status: auditStatus.info,
                score: afferentCoupling,
                scorePercent: null,
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
                `[CodeCouplingUtils - formatCouplingReports] instabilityIndex:  ${instabilityIndex}`,
            );
            const isInstabilityIndexError =
                (efferentCoupling >= 2 || afferentCoupling >= 2) && instabilityIndex > 0.5;
            auditReports.push({
                type: 'Code-Coupling',
                category: 'instability-index',
                status: isInstabilityIndexError ? auditStatus.error : auditStatus.info,
                score: instabilityIndex,
                scorePercent: null,
                scoreUnit: '',
                module: {
                    ...module,
                    path: file,
                },
            });
        }

        return auditReports;
    } catch (error) {
        AppLogger.info(
            `[CodeCouplingUtils - formatCouplingReports] reading main folder error:  ${error.message}`,
        );
        return [];
    }
};

const CodeCouplingUtils = {
    formatCouplingReports,
};

export default CodeCouplingUtils;
