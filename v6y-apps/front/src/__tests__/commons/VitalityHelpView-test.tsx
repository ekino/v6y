import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import VitalityHelpView from '../../commons/components/help/VitalityHelpView';
import { VitalityModuleType } from '../../commons/types/VitalityModulesProps';

describe('VitalityHelpView', () => {
    afterEach(() => {
        // Clear mocks after each test
        vi.clearAllMocks();
    });

    it('renders audit help details correctly', () => {
        const moduleItem: VitalityModuleType = {
            name: 'Security Module',
            label: '',
            type: 'Security',
            category: 'Code Quality',
            score: 85,
            scoreUnit: '%',
            status: 'Completed',
            branch: 'main',
            path: 'src/security',
            auditHelp: {
                category: 'Code Quality',
                title: 'Security Audit',
                description: 'Ensures code security compliance.',
                explanation: 'Detailed analysis of security vulnerabilities.',
            },
            statusHelp: {},
            evolutionHelp: {},
        };

        render(<VitalityHelpView module={moduleItem} />);

        expect(screen.getByText('Security Audit')).toBeInTheDocument();
        expect(screen.getByText('Ensures code security compliance.')).toBeInTheDocument();
        expect(
            screen.getByText('Detailed analysis of security vulnerabilities.'),
        ).toBeInTheDocument();
        expect(screen.getByText('main')).toBeInTheDocument();
        expect(screen.getByText('src/security')).toBeInTheDocument();
    });

    it('renders status help details correctly', () => {
        const moduleItem: VitalityModuleType = {
            name: 'Performance Module',
            label: '',
            type: 'Performance',
            category: 'Optimization',
            score: 90,
            scoreUnit: '%',
            status: 'Success',
            branch: 'develop',
            path: 'src/performance',
            auditHelp: {},
            statusHelp: {
                category: 'Performance',
                title: 'Performance Monitoring',
                description: 'Monitors app performance over time.',
                explanation: 'Provides insights into bottlenecks and speed improvements.',
            },
            evolutionHelp: {},
        };

        render(<VitalityHelpView module={moduleItem} />);

        expect(screen.getByText('Performance Monitoring')).toBeInTheDocument();
        expect(screen.getByText('Monitors app performance over time.')).toBeInTheDocument();
        expect(
            screen.getByText('Provides insights into bottlenecks and speed improvements.'),
        ).toBeInTheDocument();
        expect(screen.getByText('develop')).toBeInTheDocument();
        expect(screen.getByText('src/performance')).toBeInTheDocument();
    });

    it('renders evolution help details correctly', () => {
        const moduleItem: VitalityModuleType = {
            name: 'Scalability Module',
            label: '',
            type: 'Infrastructure',
            category: 'Scalability',
            score: 80,
            scoreUnit: '%',
            status: 'Warning',
            branch: 'feature-branch',
            path: 'src/scalability',
            auditHelp: {},
            statusHelp: {},
            evolutionHelp: {
                category: 'Scalability',
                title: 'Scalability Insights',
                description: 'Measures system scalability under different loads.',
                explanation: 'Provides recommendations for improving system performance.',
            },
        };

        render(<VitalityHelpView module={moduleItem} />);

        expect(screen.getByText('Scalability Insights')).toBeInTheDocument();
        expect(
            screen.getByText('Measures system scalability under different loads.'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('Provides recommendations for improving system performance.'),
        ).toBeInTheDocument();
        expect(screen.getByText('feature-branch')).toBeInTheDocument();
        expect(screen.getByText('src/scalability')).toBeInTheDocument();
    });

    it('handles missing optional fields gracefully', () => {
        const moduleItem: VitalityModuleType = {
            name: 'Module without Help',
            label: '',
            type: 'Unknown',
            category: 'Misc',
            score: 50,
            scoreUnit: '%',
            scoreStatus: 'Unknown',
            auditStatus: 'Unknown',
            branch: '',
            path: '',
            auditHelp: {}, // No help data
            statusHelp: {},
            evolutionHelp: {},
        };

        render(<VitalityHelpView module={moduleItem} />);

        // Ensure it does NOT render empty descriptions
        expect(
            screen.queryByText('vitality.appDetailsPage.audit.helpCategory'),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('vitality.appDetailsPage.audit.helpTitleLabel'),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('vitality.appDetailsPage.audit.helpDescription'),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('vitality.appDetailsPage.audit.helpExplanation'),
        ).not.toBeInTheDocument();
    });

    it('renders only relevant help information if multiple help objects exist', () => {
        const moduleItem: VitalityModuleType = {
            name: 'Complex Module',
            label: '',
            type: 'Multiple',
            category: 'MultiCategory',
            score: 75,
            scoreUnit: '%',
            scoreStatus: 'Mixed',
            auditStatus: 'Mixed',
            branch: 'main',
            path: 'src/multiple',
            auditHelp: {
                category: 'Audit',
                title: 'Audit Help Title',
                description: 'Audit description example.',
                explanation: 'Audit explanation.',
            },
            statusHelp: {
                category: 'Status',
                title: 'Status Help Title',
                description: 'Status description example.',
                explanation: 'Status explanation.',
            },
            evolutionHelp: {
                category: 'Evolution',
                title: 'Evolution Help Title',
                description: 'Evolution description example.',
                explanation: 'Evolution explanation.',
            },
        };

        render(<VitalityHelpView module={moduleItem} />);

        // Since `auditHelp` exists first in the priority order, it should be displayed
        expect(screen.getByText('Audit Help Title')).toBeInTheDocument();
        expect(screen.getByText('Audit description example.')).toBeInTheDocument();
        expect(screen.getByText('Audit explanation.')).toBeInTheDocument();

        // `statusHelp` and `evolutionHelp` should NOT be displayed
        expect(screen.queryByText('Status Help Title')).not.toBeInTheDocument();
        expect(screen.queryByText('Evolution Help Title')).not.toBeInTheDocument();
    });
});
