import { AppLogger, AuditType, auditStatus } from '@v6y/commons';
import xml2js from 'xml2js';

import {
    CodeModularityAuditType,
    NormalizedProjectTree,
    ProjectTree,
} from '../types/CodeModularityAuditType.ts';

/**
 * Default options for the code modularity auditor.
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
 * Options for the graph used in the code modularity analysis.
 */
const GRAPH_OPTIONS = {
    type: 'directed',
    allowSelfLoops: true,
    multi: false,
};

/**
 * Options for the Louvain algorithm used in the code modularity analysis.
 */
const LOUVAIN_ALGO_OPTIONS = {
    resolution: 1,
};

/**
 * Retrieves project tree data (title, x, y coordinates) from an SVG buffer.
 */
const xml2jsParser = new xml2js.Parser({});

/**
 * Retrieves project tree data (title, x, y coordinates) from an SVG buffer.
 * @param svgBuffer
 */
const retrieveProjectTreeData = async (svgBuffer: Buffer) => {
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
 * Normalizes the project tree data.
 * @param tree
 */
const normalizeProjectTree = (tree: ProjectTree): NormalizedProjectTree => {
    if (Object.keys(tree).length === 0) {
        return {
            nodes: [],
            edges: [],
        };
    }

    return Object.keys(tree).reduce(
        (acc: NormalizedProjectTree, node: string): NormalizedProjectTree => {
            return {
                ...acc,
                nodes: [...acc.nodes, node],
                edges: [
                    ...acc.edges,
                    ...(tree[node]?.map((child) => [node, child] as [string, string]) || []),
                ],
            };
        },
        { nodes: [], edges: [] },
    );
};

/**
 * Formats the code modularity reports.
 * @param application
 * @param workspaceFolder
 * @param modularitySummary
 */
const formatCodeModularityReports = ({
    application,
    workspaceFolder,
    modularitySummary,
}: CodeModularityAuditType): AuditType[] | null => {
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
            return null;
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
            projectLouvainDetails ?? {};

        if (interactionDensity !== undefined) {
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

        if (Object.keys(interactionCommunities ?? {})?.length) {
            const interactionCommunitiesGroups = Object.keys(interactionCommunities ?? {}).reduce(
                (acc: { [key: string]: string[] }, next: string) => {
                    const groupName = `group-${interactionCommunities?.[next]}`; // Optional chaining for safety
                    return {
                        ...acc,
                        [groupName]: [...(acc[groupName] || []), next],
                    };
                },
                {} as { [key: string]: string[] },
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
                        path: `[${interactionCommunitiesGroups[interactionCommunitiesGroup].join(
                            ', ',
                        )}]`,
                    },
                });
            }
        }

        if (projectDegreeCentrality && Object.keys(projectDegreeCentrality || {})?.length) {
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

        if (projectInDegreeCentrality && Object.keys(projectInDegreeCentrality || {})?.length) {
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

        if (projectOutDegreeCentrality && Object.keys(projectOutDegreeCentrality || {})?.length) {
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
        AppLogger.info(`[CodeModularityUtils - formatCodeModularityReports] error:  ${error}`);
        return null;
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
