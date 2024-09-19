import { AppLogger } from '@v6y/commons';
import { auditStatus } from '@v6y/commons/src/config/AuditHelpConfig.js';
import xml2js from 'xml2js';

import CodeModularityUtils from '../CodeModularityUtils.js';

jest.mock('@v6y/commons', () => ({
    AppLogger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('xml2js', () => ({
    Parser: jest.fn(() => ({
        parseStringPromise: jest.fn(),
    })),
}));

describe('CodeModularityUtils', () => {
    const mockApplication = {
        _id: 'app123',
        repo: { webUrl: 'https://github.com/example/repo' },
    };
    const mockWorkspaceFolder = '/path/to/workspace';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('retrieveProjectTreeData', () => {
        it('should return null if there is an error parsing the SVG content', async () => {
            const mockSvgBuffer = Buffer.from('<svg></svg>'); // Invalid SVG content
            xml2js.Parser.mockImplementationOnce(() => ({
                parseStringPromise: jest.fn().mockRejectedValue(new Error('Parsing error')),
            }));

            const result = await CodeModularityUtils.retrieveProjectTreeData(mockSvgBuffer);
            expect(result).toBeNull();
            expect(AppLogger.error).toHaveBeenCalledWith(
                'Error parsing SVG content:',
                expect.any(Error),
            );
        });

        it('should return an array of project tree data if parsing is successful', async () => {
            const mockSvgBuffer = Buffer.from(`
                <svg>
                    <g>
                        <g>
                            <title>Node 1</title>
                            <text x="10" y="20">Node 1</text>
                        </g>
                        <g>
                            <title>Node 2</title>
                            <text x="30" y="40">Node 2</text>
                        </g>
                    </g>
                </svg>
            `);
            xml2js.Parser.mockImplementationOnce(() => ({
                parseStringPromise: jest.fn().mockResolvedValue({
                    svg: {
                        g: [
                            {
                                g: [
                                    { title: ['Node 1'], text: [{ $: { x: '10', y: '20' } }] },
                                    { title: ['Node 2'], text: [{ $: { x: '30', y: '40' } }] },
                                ],
                            },
                        ],
                    },
                }),
            }));
        });
    });

    describe('normalizeProjectTree', () => {
        it('should return an empty object if the input tree is empty', () => {
            const result = CodeModularityUtils.normalizeProjectTree({});
            expect(result).toEqual({ nodes: [], edges: [] });
        });

        it('should correctly normalize a project tree', () => {
            const tree = {
                A: ['B', 'C'],
                B: ['D'],
                C: [],
                D: [],
            };
            const result = CodeModularityUtils.normalizeProjectTree(tree);
            expect(result).toEqual({
                nodes: ['A', 'B', 'C', 'D'],
                edges: [
                    ['A', 'B'],
                    ['A', 'C'],
                    ['B', 'D'],
                ],
            });
        });
    });

    describe('formatCodeModularityReports', () => {
        it('should return an empty array if no modularitySummary, application, or workspaceFolder is provided', () => {
            const result = CodeModularityUtils.formatCodeModularityReports({});
            expect(result).toEqual([]);
        });

        it('should generate reports for interaction density and independent files ratio', () => {
            const modularitySummary = {
                projectLouvainDetails: {
                    communities: { 'fileA.js': 0, 'fileB.js': 1 },
                    modularity: 0.6,
                },
            };

            const result = CodeModularityUtils.formatCodeModularityReports({
                application: mockApplication,
                workspaceFolder: mockWorkspaceFolder,
                modularitySummary,
            });

            expect(result.length).toBe(4);
            expect(result[0].category).toBe('interaction-density');
            expect(result[0].status).toBe(auditStatus.error);
            expect(result[1].category).toBe('independent-files-ratio');
            expect(result[1].status).toBe(auditStatus.error);
            expect(result[2].category).toBe('interaction-groups');
        });
    });
});
