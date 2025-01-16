import React from 'react';

import { buildCommonTableColumns, buildCommonTableDataSource } from '../config/VitalityTableConfig';
import VitalityBaseTable from './VitalityBaseTable';

interface RenderVitalityTableProps {
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

const VitalityTable: React.FC<RenderVitalityTableProps> = ({
    dataSource,
    columnKeys,
    columnOptions,
}) => {
    return (
        <VitalityBaseTable
            dataSource={buildCommonTableDataSource(dataSource)}
            columns={buildCommonTableColumns(dataSource, columnKeys, columnOptions)}
        />
    );
};

export default VitalityTable;
