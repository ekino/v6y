import { describe, expect, it } from 'vitest';

import AiSummaryUtils, { AiTechStackSummary } from '../core/AiSummaryUtils.ts';

const extractType = (stack: AiTechStackSummary) => stack.type;
const extractCategory = (entry: { category: string }) => entry.category;
const toIndexedDependency = (_: unknown, index: number) => ({
    type: 'npm',
    name: `dep-${index}`,
});

describe('AiSummaryUtils', () => {
    describe('buildTechStackSummary', () => {
        it('returns an empty array when there are no dependencies', () => {
            expect(AiSummaryUtils.buildTechStackSummary([])).toEqual([]);
            expect(AiSummaryUtils.buildTechStackSummary()).toEqual([]);
        });

        it('groups dependencies by type and counts them', () => {
            const stacks = AiSummaryUtils.buildTechStackSummary([
                { type: 'npm', name: 'react', version: '18.0.0' },
                { type: 'npm', name: 'next', version: '14.0.0' },
                { type: 'maven', name: 'spring-boot', version: '3.0.0' },
            ]);

            expect(stacks).toEqual([
                { type: 'maven', count: 1, examples: ['spring-boot'] },
                { type: 'npm', count: 2, examples: ['react', 'next'] },
            ]);
        });

        it('falls back to "other" when no type is set', () => {
            const stacks = AiSummaryUtils.buildTechStackSummary([{ name: 'unknown-lib' }]);

            const types = stacks.map(extractType);
            expect(types).toEqual(['other']);
        });

        it('caps the examples list at 5 per type', () => {
            const dependencies = Array.from({ length: 8 }, toIndexedDependency);

            const stacks = AiSummaryUtils.buildTechStackSummary(dependencies);

            expect(stacks[0].count).toBe(8);
            expect(stacks[0].examples).toEqual(['dep-0', 'dep-1', 'dep-2', 'dep-3', 'dep-4']);
        });
    });

    describe('buildAuditHealthSummary', () => {
        it('returns an empty array when there are no audits', () => {
            expect(AiSummaryUtils.buildAuditHealthSummary([])).toEqual([]);
            expect(AiSummaryUtils.buildAuditHealthSummary()).toEqual([]);
        });

        it('keeps one entry per category with its score, status and unit', () => {
            const health = AiSummaryUtils.buildAuditHealthSummary([
                { category: 'performance', score: 88, scoreStatus: 'success', scoreUnit: '/100' },
                { category: 'security', score: 42, scoreStatus: 'error', scoreUnit: '/100' },
            ]);

            expect(health).toEqual([
                { category: 'performance', score: 88, scoreStatus: 'success', scoreUnit: '/100' },
                { category: 'security', score: 42, scoreStatus: 'error', scoreUnit: '/100' },
            ]);
        });

        it('sorts entries by category and falls back to type/"other" when no category is set', () => {
            const health = AiSummaryUtils.buildAuditHealthSummary([
                { type: 'devops', score: 70 },
                { category: 'accessibility', score: 90 },
                { score: 10 },
            ]);

            expect(health.map(extractCategory)).toEqual(['accessibility', 'devops', 'other']);
        });

        it('deduplicates by category, keeping the latest entry seen for that category', () => {
            const health = AiSummaryUtils.buildAuditHealthSummary([
                { category: 'performance', score: 60 },
                { category: 'performance', score: 88 },
            ]);

            expect(health).toEqual([
                { category: 'performance', score: 88, scoreStatus: null, scoreUnit: null },
            ]);
        });
    });

    describe('buildAiSummaryPrompt', () => {
        it('builds a compact system/user prompt referencing the app name, description, tech stack and audit health', () => {
            const { system, user } = AiSummaryUtils.buildAiSummaryPrompt({
                application: { name: 'Vitality', description: 'A code audit platform' },
                techStack: [{ type: 'npm', count: 2, examples: ['react', 'next'] }],
                auditHealth: [
                    {
                        category: 'performance',
                        score: 88,
                        scoreStatus: 'success',
                        scoreUnit: '/100',
                    },
                ],
            });

            expect(system).toContain('non-expert, business-oriented audience');
            expect(system).toContain('plain-language summary');
            expect(system).toContain('Respond in English');
            expect(user).toContain('Vitality');
            expect(user).toContain('A code audit platform');
            expect(user).toContain('npm: 2 dependencies (e.g. react, next)');
            expect(user).toContain('performance: 88/100 (success)');
        });

        it('includes the application acronym and organization as extra context when available', () => {
            const { user } = AiSummaryUtils.buildAiSummaryPrompt({
                application: {
                    name: 'Vitality',
                    acronym: 'VLT',
                    repo: { organization: 'ekino' },
                },
                techStack: [],
            });

            expect(user).toContain('Vitality (VLT)');
            expect(user).toContain('organization: ekino');
        });

        it('instructs the model to never claim missing context and to answer as strict JSON', () => {
            const { system } = AiSummaryUtils.buildAiSummaryPrompt({
                application: { name: 'Vitality' },
                techStack: [],
            });

            expect(system).toContain('complete set of information available');
            expect(system).toContain('Never state, imply or hedge that information');
            expect(system).toContain('{"bullets": string[], "score": number}');
        });

        it('stays short even with no tech stack or audit data available', () => {
            const { user } = AiSummaryUtils.buildAiSummaryPrompt({
                application: { name: 'Vitality' },
                techStack: [],
            });
            expect(user).toContain('no dependency data available');
            expect(user).toContain('no audit data available');
        });

        it('responds in the requested language, defaulting to English otherwise', () => {
            const { system: englishSystem } = AiSummaryUtils.buildAiSummaryPrompt({
                application: { name: 'Vitality' },
                techStack: [],
                auditHealth: [],
            });
            expect(englishSystem).toContain('Respond in English');

            const { system: frenchSystem } = AiSummaryUtils.buildAiSummaryPrompt({
                application: { name: 'Vitality' },
                techStack: [],
                auditHealth: [],
                language: 'fr',
            });
            expect(frenchSystem).toContain('Respond in French');
        });
    });

    describe('parseAiSummaryBullets', () => {
        it('parses a well-formed JSON response into its bullet list', () => {
            const bullets = AiSummaryUtils.parseAiSummaryBullets(
                JSON.stringify({ bullets: ['First point', 'Second point'] }),
            );

            expect(bullets).toEqual(['First point', 'Second point']);
        });

        it('trims whitespace, drops empty entries and caps the list at 4 items', () => {
            const bullets = AiSummaryUtils.parseAiSummaryBullets(
                JSON.stringify({ bullets: [' A ', '', 'B', 'C', 'D', 'E'] }),
            );

            expect(bullets).toEqual(['A', 'B', 'C', 'D']);
        });

        it('falls back to plain-text, newline-separated parsing when the content is not valid JSON', () => {
            const bullets = AiSummaryUtils.parseAiSummaryBullets(
                '- First point\n• Second point\nThird point',
            );

            expect(bullets).toEqual(['First point', 'Second point', 'Third point']);
        });

        it('falls back to plain-text parsing when the JSON has no usable bullets array', () => {
            const bullets = AiSummaryUtils.parseAiSummaryBullets(JSON.stringify({ bullets: [] }));

            expect(bullets).toEqual([JSON.stringify({ bullets: [] })]);
        });
    });

    describe('parseAiSummaryScore', () => {
        it('parses a well-formed JSON response into its score', () => {
            const score = AiSummaryUtils.parseAiSummaryScore(
                JSON.stringify({ bullets: ['First point'], score: 7 }),
            );

            expect(score).toBe(7);
        });

        it('clamps the score between 0 and 10', () => {
            expect(
                AiSummaryUtils.parseAiSummaryScore(JSON.stringify({ bullets: [], score: 42 })),
            ).toBe(10);
            expect(
                AiSummaryUtils.parseAiSummaryScore(JSON.stringify({ bullets: [], score: -3 })),
            ).toBe(0);
        });

        it('rounds a non-integer score', () => {
            const score = AiSummaryUtils.parseAiSummaryScore(
                JSON.stringify({ bullets: [], score: 6.6 }),
            );

            expect(score).toBe(7);
        });

        it('returns null when the content is not valid JSON', () => {
            const score = AiSummaryUtils.parseAiSummaryScore('- First point\nSecond point');

            expect(score).toBeNull();
        });

        it('returns null when the JSON has no usable score', () => {
            const score = AiSummaryUtils.parseAiSummaryScore(
                JSON.stringify({ bullets: ['First point'] }),
            );

            expect(score).toBeNull();
        });
    });
});
