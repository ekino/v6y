import { AdminTableOptions } from '@v6y/shared-ui';
import * as React from 'react';

import { buildCommonTableColumns, buildCommonTableDataSource } from '../config/VitalityTableConfig';
import VitalityBaseTable from './VitalityBaseTable';

interface VitalityTableProps {
    dataSource: unknown[];
    columnKeys: string[];
    columnOptions: AdminTableOptions;
}

const VitalityTable = ({ dataSource, columnKeys, columnOptions }: VitalityTableProps) => {
    return (
        <VitalityBaseTable
            dataSource={buildCommonTableDataSource(dataSource)}
            columns={buildCommonTableColumns(dataSource, columnKeys, columnOptions)}
        />
    );
};

export default VitalityTable;
