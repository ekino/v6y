import * as React from 'react';

import { buildCommonTableColumns, buildCommonTableDataSource } from '../config/VitalityTableConfig';
import VitalityBaseTable from './VitalityBaseTable';

interface VitalityTableProps {
    dataSource: unknown[];
    columnKeys: string[];
    columnOptions: {
        enableEdit: boolean;
        enableShow: boolean;
        enableDelete: boolean;
        deleteMetaQuery?: {
            gqlMutation: string;
            operation: string;
        };
    };
}

const VitalityTable: React.FC<VitalityTableProps> = ({ dataSource, columnKeys, columnOptions }) => {
    return (
        <VitalityBaseTable
            dataSource={buildCommonTableDataSource(dataSource)}
            columns={buildCommonTableColumns(dataSource, columnKeys, columnOptions)}
        />
    );
};

export default VitalityTable;
