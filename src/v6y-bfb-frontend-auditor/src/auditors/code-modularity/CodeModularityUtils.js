import { AppLogger } from '@v6y/commons';
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
    resolution: 0.98,
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

const CodeModularityUtils = {
    GRAPH_OPTIONS,
    LOUVAIN_ALGO_OPTIONS,
    defaultOptions,
    normalizeProjectTree,
    retrieveProjectTreeData,
};

export default CodeModularityUtils;
