import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/commons';
import Graph from 'graphology';
import louvain from 'graphology-communities-louvain';
import {
    degreeCentrality,
    inDegreeCentrality,
    outDegreeCentrality,
} from 'graphology-metrics/centrality/degree.js';
import { density } from 'graphology-metrics/graph/density.js';
import Madge from 'madge';

import CodeModularityUtils from './CodeModularityUtils.js';

const {
    GRAPH_OPTIONS,
    LOUVAIN_ALGO_OPTIONS,
    defaultOptions,
    normalizeProjectTree,
    retrieveProjectTreeData,
    formatCodeModularityReports,
} = CodeModularityUtils;

/**
 * Starts the auditor analysis for code modularity.
 *
 * @param {Object} params - The parameters for the analysis.
 * @param {string} params.applicationId - The ID of the application.
 * @param {string} params.workspaceFolder - The path to the workspace folder.
 * @returns {Promise<boolean>} - Returns true if the analysis was successful, otherwise false.
 */
const startAuditorAnalysis = async ({ applicationId, workspaceFolder }) => {
    try {
        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );

        if (applicationId === undefined || !workspaceFolder?.length) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            appId: applicationId,
        });
        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        if (!application?._id) {
            return false;
        }

        const projectAnalysisResult = await Madge(workspaceFolder, defaultOptions);
        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] projectAnalysisResult:  ${projectAnalysisResult}`,
        );

        if (!projectAnalysisResult) {
            return false;
        }

        const projectTree = projectAnalysisResult.obj();
        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] projectTree:  ${projectTree}`,
        );

        if (!projectTree || !Object.keys(projectTree || {})?.length) {
            return false;
        }

        const projectTreeVisualization = await projectAnalysisResult.svg();
        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] projectTreeVisualization:  ${projectTreeVisualization}`,
        );

        if (!projectTreeVisualization) {
            return false;
        }

        const { nodes, edges } = normalizeProjectTree(projectTree) || {};
        AppLogger.info(`[CodeModularityAuditor - startAuditorAnalysis] nodes:  ${nodes?.length}`);
        AppLogger.info(`[CodeModularityAuditor - startAuditorAnalysis] edges:  ${edges?.length}`);

        if (!nodes?.length || !edges?.length) {
            return false;
        }

        const projectTreeData = await retrieveProjectTreeData(projectTreeVisualization);
        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] projectTreeData:  ${projectTreeData}`,
        );

        if (!projectTreeData) {
            return false;
        }

        const projectGraph = new Graph(GRAPH_OPTIONS);

        nodes
            .filter((item) => item)
            .reverse()
            .forEach((node, index) => {
                const nodeData = projectTreeData.find((item) => item.title === node);
                if (nodeData) {
                    projectGraph.addNode(nodeData.title, { x: nodeData.x, y: nodeData.y });
                }
            });

        edges
            .filter((item) => item)
            .reverse()
            .forEach(([source, target]) => {
                projectGraph.addEdge(source, target);
            });

        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] projectGraph:  ${projectGraph}`,
        );

        const louvainDetails = louvain.detailed(projectGraph, LOUVAIN_ALGO_OPTIONS);
        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] louvainDetails:  ${louvainDetails}`,
        );

        const auditReports = formatCodeModularityReports({
            application,
            workspaceFolder,
            modularitySummary: {
                projectTree,
                projectGraph,
                projectLouvainDetails: louvainDetails,
                projectDensity: density(projectGraph),
                projectDegreeCentrality: degreeCentrality(projectGraph),
                projectInDegreeCentrality: inDegreeCentrality(projectGraph),
                projectOutDegreeCentrality: outDegreeCentrality(projectGraph),
            },
        });

        await AuditProvider.insertAuditList(auditReports);

        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] audit reports inserted successfully`,
        );
        return true;
    } catch (error) {
        AppLogger.error(
            '[CodeModularityAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

const CodeModularityAuditor = {
    startAuditorAnalysis,
};

export default CodeModularityAuditor;
