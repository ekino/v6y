import { AppLogger } from '@v6y/commons';
import { auditStatus } from '@v6y/commons/src/config/AuditHelpConfig.js';
import xml2js from 'xml2js';

/**
 * Default options for Madge analysis.
 * @const {Object} defaultOptions
 * @property {string[]} fileExtensions - Array of file extensions to include in the analysis.
 * @property {RegExp[]} excludeRegExp - Array of regular expressions to exclude files or directories from the analysis.
 */
const defaultOptions = {
    fileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    excludeRegExp: [
        '.*node_modules/.*',
        '.*target/.*',
        '.*dist/.*',
        '.*__mocks__/.*',
        '.*husky/.*',
        '.*vscode/.*',
        '.*idea/.*',
        '.*gitlab/.*',
        '.*github/.*',
        '.*eslint.*',
        '.*jest.*',
        '.*test.*',
        '.*babel.*',
        '.*webpack.*',
        '.*.config.*',
        '.*.types.*',
        '.*.svg',
        '.*.d.ts.*',
    ],
};

/**
 * Options for creating the Graphology graph.
 * @const {Object} GRAPH_OPTIONS
 * @property {'directed'} type - Specifies a directed graph.
 * @property {true} allowSelfLoops - Allows self-loops in the graph.
 * @property {false} multi - Disallows multiple edges between the same pair of nodes.
 */
const GRAPH_OPTIONS = {
    type: 'directed',
    allowSelfLoops: true,
    multi: false,
};

/**
 * Options for the Louvain community detection algorithm.
 * @const {Object} LOUVAIN_ALGO_OPTIONS
 * @property {number} resolution - Resolution parameter for the Louvain algorithm (default: 1).
 */
const LOUVAIN_ALGO_OPTIONS = {
    resolution: 1,
};

/**
 * XML to JavaScript parser instance.
 * @const {xml2js.Parser} xml2jsParser
 */
const xml2jsParser = new xml2js.Parser({});

/**
 * Retrieves project tree data (title, x, y coordinates) from an SVG buffer.
 * @async
 * @function retrieveProjectTreeData
 * @param {Buffer} svgBuffer - The SVG content as a buffer.
 * @returns {Promise<Array<{title: string, x: number, y: number}> | null>} - An array of objects containing title, x, and y coordinates or null on error.
 */
const retrieveProjectTreeData = async (svgBuffer) => {
    try {
        const svgContent = svgBuffer.toString();
        const result = await xml2jsParser.parseStringPromise(svgContent);
        const svg = result.svg;

        const svgData = [];
        const nodes = svg.g[0].g;

        for (const node of nodes) {
            const title = node.title?.[0];
            if (!title?.length) {
                continue;
            }

            const textNode = node.text?.[0]?.$;
            if (!textNode) {
                continue;
            }

            let x = 0;
            let y = 0;

            if (textNode) {
                x = parseFloat(textNode.x);
                y = parseFloat(textNode.y);
            }

            svgData.push({ title, x, y });
        }

        return svgData;
    } catch (error) {
        AppLogger.error('Error parsing SVG content:', error);
        return null;
    }
};

/**
 * Normalizes the project tree structure.
 * @function normalizeProjectTree
 * @param {Object} tree - The project tree object.
 * @returns {Object} - An object containing `nodes` (array of node names) and `edges` (array of [source, target] pairs).
 */
const normalizeProjectTree = (tree) => {
    if (Object.keys(tree).length === 0) {
        return {
            nodes: [],
            edges: [],
        };
    }

    return Object.keys(tree).reduce((acc, node) => {
        return {
            ...acc,
            nodes: [...(acc.nodes || []), node],
            edges: [...(acc.edges || []), ...(tree[node]?.map((child) => [node, child]) || [])],
        };
    }, {});
};

const formatCodeModularityReports = ({ application, workspaceFolder, modularitySummary }) => {
    try {
        AppLogger.info(
            `[CodeModularityUtils - formatCodeModularityReports] application:  ${application}`,
        );
        AppLogger.info(
            `[CodeModularityUtils - formatCodeModularityReports] workspaceFolder:  ${workspaceFolder}`,
        );
        AppLogger.info(
            `[CodeModularityUtils - formatCodeModularityReports] modularitySummary:  ${modularitySummary}`,
        );

        if (!modularitySummary || !application || !workspaceFolder) {
            return [];
        }

        const {
            projectLouvainDetails,
            projectDegreeCentrality,
            projectInDegreeCentrality,
            projectOutDegreeCentrality,
        } = modularitySummary;

        const auditReports = [];
        const module = {
            appId: application?._id,
            url: application?.repo?.webUrl,
            branch: workspaceFolder.split('/').pop(),
            path: '',
        };

        const { communities: interactionCommunities, modularity: interactionDensity } =
            projectLouvainDetails || {};

        if (interactionDensity) {
            const independentFileRatio = 1 - interactionDensity;
            auditReports.push({
                type: 'Code-Modularity',
                category: 'interaction-density',
                status: interactionDensity > 0.5 ? auditStatus.error : auditStatus.info,
                score: interactionDensity,
                scoreUnit: '%',
                module: {
                    ...module,
                    path: workspaceFolder,
                },
            });
            auditReports.push({
                type: 'Code-Modularity',
                category: 'independent-files-ratio',
                status: independentFileRatio < 0.5 ? auditStatus.error : auditStatus.info,
                score: independentFileRatio,
                scoreUnit: '%',
                module: {
                    ...module,
                    path: workspaceFolder,
                },
            });
        }

        if (Object.keys(interactionCommunities || {})?.length) {
            const interactionCommunitiesGroups = Object.keys(interactionCommunities).reduce(
                (acc, next) => ({
                    ...acc,
                    [`group-${interactionCommunities[next]}`]: [
                        ...(acc[`group-${interactionCommunities[next]}`] || []),
                        next,
                    ],
                }),
                {},
            );

            for (const interactionCommunitiesGroup of Object.keys(interactionCommunitiesGroups)) {
                auditReports.push({
                    type: 'Code-Modularity',
                    category: 'interaction-groups',
                    status: auditStatus.info,
                    score: null,
                    extraInfos: interactionCommunitiesGroup,
                    scoreUnit: '',
                    module: {
                        ...module,
                        path: `[${interactionCommunitiesGroups[interactionCommunitiesGroup].join(', ')}]`,
                    },
                });
            }
        }

        if (Object.keys(projectDegreeCentrality || {})?.length) {
            for (const fileDegreeCentrality of Object.keys(projectDegreeCentrality)) {
                auditReports.push({
                    type: 'Code-Modularity',
                    category: 'file-degree-centrality',
                    status: auditStatus.info,
                    score: projectDegreeCentrality[fileDegreeCentrality],
                    scoreUnit: '',
                    module: {
                        ...module,
                        path: fileDegreeCentrality,
                    },
                });
            }
        }

        if (Object.keys(projectInDegreeCentrality || {})?.length) {
            for (const fileInDegreeCentrality of Object.keys(projectInDegreeCentrality)) {
                auditReports.push({
                    type: 'Code-Modularity',
                    category: 'file-in-degree-centrality',
                    status: auditStatus.info,
                    score: projectInDegreeCentrality[fileInDegreeCentrality],
                    scoreUnit: '',
                    module: {
                        ...module,
                        path: fileInDegreeCentrality,
                    },
                });
            }
        }

        if (Object.keys(projectOutDegreeCentrality || {})?.length) {
            for (const fileOutDegreeCentrality of Object.keys(projectOutDegreeCentrality)) {
                auditReports.push({
                    type: 'Code-Modularity',
                    category: 'file-out-degree-centrality',
                    status: auditStatus.info,
                    score: projectOutDegreeCentrality[fileOutDegreeCentrality],
                    scoreUnit: '',
                    module: {
                        ...module,
                        path: fileOutDegreeCentrality,
                    },
                });
            }
        }

        return auditReports;
    } catch (error) {
        AppLogger.info(
            `[CodeModularityUtils - formatCodeModularityReports] reading main folder error:  ${error.message}`,
        );
        return [];
    }
};

const CodeModularityUtils = {
    GRAPH_OPTIONS,
    LOUVAIN_ALGO_OPTIONS,
    defaultOptions,
    normalizeProjectTree,
    retrieveProjectTreeData,
    formatCodeModularityReports,
};

export default CodeModularityUtils;
