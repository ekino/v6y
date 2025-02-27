import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import VitalityTableRowActions from '../commons/components/VitalityTableRowActions';
import {
    buildCommonTableColumns,
    buildCommonTableDataSource,
} from '../commons/config/VitalityTableConfig';

describe('VitalityTableConfig - Table Data Handling', () => {
    it('should build a valid data source with _id as key', () => {
        const mockData = [
            { _id: '123', name: 'Alice' },
            { _id: '456', name: 'Bob' },
        ];

        const result = buildCommonTableDataSource(mockData);
        expect(result).toEqual([
            { _id: '123', name: 'Alice', key: '123' },
            { _id: '456', name: 'Bob', key: '456' },
        ]);
    });

    it('should build valid table columns excluding specified keys', () => {
        const mockData = [{ _id: '123', name: 'Alice', email: 'alice@example.com' }];
        const excludedKeys = ['email'];
        const mockOptions = { enableEdit: true, enableShow: true, enableDelete: true };

        const columns = buildCommonTableColumns(mockData, excludedKeys, mockOptions);

        expect(columns).toEqual([
            { title: '_id', dataIndex: '_id', key: '_id' },
            {
                dataIndex: 'name',
                key: 'name',
                title: 'name',
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                render: expect.any(Function),
            },
        ]);
    });

    it('should render row actions based on options', () => {
        const mockRecord = { _id: '789', name: 'Charlie' };
        const options = { enableEdit: true, enableShow: false, enableDelete: true };

        render(<VitalityTableRowActions record={mockRecord} options={options} />);

        expect(screen.getByTestId('edit-789')).toBeInTheDocument();
        expect(screen.queryByTestId('show-789')).not.toBeInTheDocument();
        expect(screen.getByTestId('delete-789')).toBeInTheDocument();
    });

    it('should not render any actions when all options are disabled', () => {
        const mockRecord = { _id: '101', name: 'Dana' };
        const options = { enableEdit: false, enableShow: false, enableDelete: false };

        render(<VitalityTableRowActions record={mockRecord} options={options} />);

        expect(screen.queryByTestId('edit-101')).not.toBeInTheDocument();
        expect(screen.queryByTestId('show-101')).not.toBeInTheDocument();
        expect(screen.queryByTestId('delete-101')).not.toBeInTheDocument();
    });

    it('should render no actions if all options are disabled', () => {
        const mockRecord = { _id: '999', name: 'NoActions' };
        const options = { enableEdit: false, enableShow: false, enableDelete: false };

        render(<VitalityTableRowActions record={mockRecord} options={options} />);

        expect(screen.queryByTestId('edit-999')).not.toBeInTheDocument();
        expect(screen.queryByTestId('show-999')).not.toBeInTheDocument();
        expect(screen.queryByTestId('delete-999')).not.toBeInTheDocument();
    });

    it('should exclude specified keys when building table columns', () => {
        const mockData = [{ _id: '123', name: 'Test', secret: 'Hidden' }];
        const excludedKeys = ['secret'];
        const options = { enableEdit: true, enableShow: true, enableDelete: true };

        const columns = buildCommonTableColumns(mockData, excludedKeys, options);

        expect(columns.some((col) => col.dataIndex === 'secret')).toBe(false);
    });
});
