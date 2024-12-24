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

import { CodeModularityAuditType } from '../types/CodeModularityAuditType.ts';
import CodeModularityUtils from './CodeModularityUtils.ts';

const {
    GRAPH_OPTIONS,
    LOUVAIN_ALGO_OPTIONS,
    defaultOptions,
    normalizeProjectTree,
    retrieveProjectTreeData,
    formatCodeModularityReports,
} = CodeModularityUtils;

/**
 * Start the auditor analysis
 * @param applicationId
 * @param workspaceFolder
 */
const startAuditorAnalysis = async ({
    applicationId,
    workspaceFolder,
}: CodeModularityAuditType) => {
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
            _id: applicationId,
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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const projectGraph = new Graph(GRAPH_OPTIONS);

        nodes
            .filter((item) => item !== undefined && item !== null) // Explicit filtering for null/undefined
            .reverse()
            .forEach((node) => {
                const nodeData = projectTreeData.find(
                    (item: { title: string }) => item.title === node,
                );
                if (nodeData) {
                    projectGraph.addNode(nodeData.title, {
                        x: nodeData.x,
                        y: nodeData.y,
                    });
                }
            });

        edges
            .filter((item) => item !== undefined && item !== null) // Explicit filtering for null/undefined
            .reverse()
            .forEach(([source, target]) => {
                projectGraph.addEdge(source, target);
            });

        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] projectGraph:  ${projectGraph}`,
        );

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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
