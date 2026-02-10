import * as React from 'react';

import Table from '@v6y/ui-kit/components/atoms/app/Table';
import { AdminTableOptions } from '@v6y/ui-kit/components/types/AdminTableType';

import { buildCommonTableColumns, buildCommonTableDataSource } from '../config/VitalityTableConfig';

interface VitalityTableProps {
    dataSource: unknown[];
    columnKeys: string[];
    columnOptions: AdminTableOptions;
}

const VitalityTable = ({ dataSource, columnKeys, columnOptions }: VitalityTableProps) => {
    return (
        <Table
            dataSource={buildCommonTableDataSource(dataSource)}
            columns={buildCommonTableColumns(dataSource, columnKeys, columnOptions)}
            rowKey="key"
        />
    );
};

export default VitalityTable;
