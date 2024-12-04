// VitalityDependenciesStatusGrouper.test.tsx
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { DependencyType } from '@v6y/commons';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView';
import VitalityDependenciesStatusGrouper from '../dependencies/VitalityDependenciesStatusGrouper';

// Mock dynamic import to return the actual VitalityModulesView component
vi.mock('next/dynamic', () => ({
    default: vi.fn((callback) => callback().default),
}));

// Mock VitalityTabGrouperView
vi.mock('../../../../commons/components/VitalityTabGrouperView');

describe('VitalityDependenciesStatusGrouper', () => {
    const mockDependencies: DependencyType[] = [
        {
            name: 'Dependency 1',
            version: '1.0.0',
            status: 'success',
            // ... other properties
        },
        {
            name: 'Dependency 2',
            version: '2.0.0',
            status: 'warning',
            // ... other properties
        },
    ];

    it('should render the component with dependencies', () => {
        render(<VitalityDependenciesStatusGrouper dependencies={mockDependencies} />);

        expect(VitalityTabGrouperView).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'dependencies_grouper_tab',
                ariaLabelledby: 'dependencies_grouper_tab_content',
                align: 'center',
                criteria: 'status',
                hasAllGroup: true,
                dataSource: mockDependencies,
            }),
            expect.anything(),
        );
    });

    it('should render the component with no dependencies', () => {
        render(<VitalityDependenciesStatusGrouper dependencies={[]} />);

        expect(VitalityTabGrouperView).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'dependencies_grouper_tab',
                ariaLabelledby: 'dependencies_grouper_tab_content',
                align: 'center',
                criteria: 'status',
                hasAllGroup: true,
                dataSource: [],
            }),
            expect.anything(),
        );
    });

    it('should render the component with dependencies of different statuses', () => {
        const mixedStatusDependencies: DependencyType[] = [
            { name: 'Dependency 3', version: '3.0.0', status: 'error' },
            { name: 'Dependency 4', version: '4.0.0', status: 'success' },
        ];

        render(<VitalityDependenciesStatusGrouper dependencies={mixedStatusDependencies} />);

        expect(VitalityTabGrouperView).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'dependencies_grouper_tab',
                ariaLabelledby: 'dependencies_grouper_tab_content',
                align: 'center',
                criteria: 'status',
                hasAllGroup: true,
                dataSource: mixedStatusDependencies,
            }),
            expect.anything(),
        );
    });
});
