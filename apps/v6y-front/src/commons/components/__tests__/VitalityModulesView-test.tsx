// VitalityModulesView.test.tsx
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { VitalityModuleType } from '../../types/VitalityModulesProps';
import VitalityModulesView from '../modules/VitalityModulesView';

// Mock dynamic import to return the actual VitalityHelpView component
vi.mock('next/dynamic', () => ({
    default: vi.fn((callback) => callback().default),
}));

describe('VitalityModulesView', () => {
    const mockModules: VitalityModuleType[] = [
        {
            name: 'Module 1',
            label: 'Module 1 Label',
            type: 'type1',
            category: 'category1',
            score: 80,
            scoreUnit: '%',
            status: 'success',
            auditHelp: {
                category: 'Help Category 1',
                title: 'Help Title 1',
                description: 'Help Description 1',
                explanation: 'Help Explanation 1',
            },
            branch: 'main',
            path: '/path/to/file1',
            statusHelp: {},
            evolutionHelp: {},
        },
        {
            name: 'Module 2',
            label: 'Module 2 Label',
            type: 'type2',
            category: 'category2',
            score: 60,
            scoreUnit: 'points',
            status: 'warning',
            auditHelp: {},
            statusHelp: {
                category: 'Help Category 2',
                title: 'Help Title 2',
                description: 'Help Description 2',
                explanation: 'Help Explanation 2',
            },
            branch: 'develop',
            path: '/path/to/file2',
            evolutionHelp: {},
        },
    ];

    it('should render the component with modules', () => {
        render(<VitalityModulesView modules={mockModules} />);

        expect(screen.getByText('Module 1')).toBeInTheDocument();
        expect(screen.getByText('Module 2')).toBeInTheDocument();
    });

    it('should render module details correctly', () => {
        render(<VitalityModulesView modules={mockModules} />);

        // Check Module 1 details
        expect(screen.getByText('Module 1')).toBeInTheDocument();
        expect(screen.getByText('80')).toBeInTheDocument();
        expect(screen.getByText('%')).toBeInTheDocument();
        expect(screen.getByText('main')).toBeInTheDocument();
        expect(screen.getByText('/path/to/file1')).toBeInTheDocument();

        // Check Module 2 details
        expect(screen.getByText('60')).toBeInTheDocument();
        expect(screen.getByText('points')).toBeInTheDocument();
        expect(screen.getByText('develop')).toBeInTheDocument();
        expect(screen.getByText('/path/to/file2')).toBeInTheDocument();
    });

    it('should handle modules with missing optional fields', () => {
        const incompleteModules: VitalityModuleType[] = [
            {
                name: 'Module 3',
                label: '',
                type: '',
                category: '',
                score: undefined,
                scoreUnit: '',
                status: '',
                auditHelp: {},
                branch: '',
                path: '',
                statusHelp: {},
                evolutionHelp: {},
            },
        ];

        render(<VitalityModulesView modules={incompleteModules} />);

        // Check if Module 3 is rendered without errors
        expect(screen.getByText('Module 3')).toBeInTheDocument();
    });
});
