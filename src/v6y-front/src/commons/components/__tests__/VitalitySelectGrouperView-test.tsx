// VitalitySelectGrouperView.test.tsx
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useDataGrouper from '../../hooks/useDataGrouper';
import VitalitySelectGrouperView from '../VitalitySelectGrouperView';

// Mock useDataGrouper hook
vi.mock('../../hooks/useDataGrouper');

describe('VitalitySelectGrouperView', () => {
    const mockDataSource = [
        { name: 'Item 1', group: 'Group A' },
        { name: 'Item 2', group: 'Group B' },
        { name: 'Item 3', group: 'Group A' },
    ];
    const mockCriteria = 'group';
    const mockPlaceholder = 'Select a group';
    const mockLabel = 'Group by';
    const mockHelper = 'Select a group to filter items';
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
            selectedCriteria: { key: '', label: undefined, value: 'All' },
            criteriaGroups: [
                { value: 'All', label: 'All' },
                { value: 'Group A', label: 'Group A' },
                { value: 'Group B', label: 'Group B' },
            ],
            setSelectedCriteria: vi.fn(),
        });
    });

    it('should render the component with data', () => {
        render(
            <VitalitySelectGrouperView
                dataSource={mockDataSource}
                criteria={mockCriteria}
                placeholder={mockPlaceholder}
                label={mockLabel}
                helper={mockHelper}
                onRenderChildren={mockOnRenderChildren}
            />,
        );

        expect(screen.getByRole('form')).toBeInTheDocument();
        expect(screen.getByText(mockLabel)).toBeInTheDocument();
        expect(screen.getByText(mockHelper)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render an empty view if dataSource or criteria is empty', () => {
        render(<VitalitySelectGrouperView dataSource={[]} criteria={mockCriteria} />);
        expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('should render an empty view if groupedDataSource is empty', () => {
        useDataGrouper.mockReturnValue({
            groupedDataSource: {},
            selectedCriteria: { key: '', label: undefined, value: 'All' },
            criteriaGroups: [],
            setSelectedCriteria: vi.fn(),
        });

        render(
            <VitalitySelectGrouperView
                dataSource={mockDataSource}
                criteria={mockCriteria}
                onRenderChildren={mockOnRenderChildren}
            />,
        );
        expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('should update selectedCriteria when the select value changes', async () => {
        render(
            <VitalitySelectGrouperView
                dataSource={mockDataSource}
                criteria={mockCriteria}
                placeholder={mockPlaceholder}
                label={mockLabel}
                helper={mockHelper}
                onRenderChildren={mockOnRenderChildren}
            />,
        );

        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: 'Group A' } });

        expect(useDataGrouper).toHaveBeenLastCalledWith({
            dataSource: mockDataSource,
            criteria: mockCriteria,
            hasAllGroup: undefined,
        });
    });

    it('should call onRenderChildren with correct parameters', () => {
        render(
            <VitalitySelectGrouperView
                dataSource={mockDataSource}
                criteria={mockCriteria}
                placeholder={mockPlaceholder}
                label={mockLabel}
                helper={mockHelper}
                onRenderChildren={mockOnRenderChildren}
            />,
        );

        expect(mockOnRenderChildren).toHaveBeenCalledWith('All', mockDataSource);
    });

    it('should render correct items based on selected criteria', async () => {
        render(
            <VitalitySelectGrouperView
                dataSource={mockDataSource}
                criteria={mockCriteria}
                placeholder={mockPlaceholder}
                label={mockLabel}
                helper={mockHelper}
                onRenderChildren={mockOnRenderChildren}
            />,
        );

        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: 'Group A' } });

        expect(screen.getAllByText('Group A')?.[0]).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
});
