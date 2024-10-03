// VitalityTabGrouperView.test.tsx
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useDataGrouper from '../../hooks/useDataGrouper';
import VitalityTabGrouperView from '../VitalityTabGrouperView';

// Mock useDataGrouper hook
vi.mock('../../hooks/useDataGrouper');

describe('VitalityTabGrouperView', () => {
    const mockDataSource = [
        { name: 'Item 1', group: 'Group A' },
        { name: 'Item 2', group: 'Group B' },
        { name: 'Item 3', group: 'Group A' },
    ];
    const mockCriteria = 'group';
    const mockPlaceholder = 'Tab a group';
    const mockLabel = 'Group by';
    const mockHelper = 'Tab a group to filter items';
    const mockOnRenderChildren = vi.fn((group, items) => (
        <div>
            <h3>{group}</h3>
            <ul>
                {items.map((item) => (
                    <li key={item.name}>{item.name}</li>
                ))}
            </ul>
        </div>
    ));

    beforeEach(() => {
        useDataGrouper.mockReturnValue({
            groupedDataSource: {
                'Group A': [
                    { name: 'Item 1', group: 'Group A' },
                    { name: 'Item 3', group: 'Group A' },
                ],
                'Group B': [{ name: 'Item 2', group: 'Group B' }],
            },
            TabedCriteria: { key: '', label: undefined, value: 'All' },
            criteriaGroups: [
                { value: 'All', label: 'All' },
                { value: 'Group A', label: 'Group A' },
                { value: 'Group B', label: 'Group B' },
            ],
            setTabedCriteria: vi.fn(),
        });
    });

    it('should render the component with data', () => {
        render(
            <VitalityTabGrouperView
                dataSource={mockDataSource}
                criteria={mockCriteria}
                placeholder={mockPlaceholder}
                label={mockLabel}
                helper={mockHelper}
                onRenderChildren={mockOnRenderChildren}
            />,
        );

        expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('should render an empty view if groupedDataSource is empty', () => {
        useDataGrouper.mockReturnValue({
            groupedDataSource: {},
            TabedCriteria: { key: '', label: undefined, value: 'All' },
            criteriaGroups: [],
            setTabedCriteria: vi.fn(),
        });

        render(
            <VitalityTabGrouperView
                dataSource={mockDataSource}
                criteria={mockCriteria}
                onRenderChildren={mockOnRenderChildren}
            />,
        );
        expect(screen.getByText('No data')).toBeInTheDocument();
    });
});
