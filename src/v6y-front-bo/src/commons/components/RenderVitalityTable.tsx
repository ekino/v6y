import React from 'react';

import { buildCommonTableColumns, buildCommonTableDataSource } from '../config/VitalityTableConfig';
import VitalityTable from './VitalityTable';

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

const RenderVitalityTable: React.FC<RenderVitalityTableProps> = ({
    dataSource,
    columnKeys,
    columnOptions,
}) => {
    return (
        <VitalityTable
            dataSource={buildCommonTableDataSource(dataSource)}
            columns={buildCommonTableColumns(dataSource, columnKeys, columnOptions)}
        />
    );
};

export default RenderVitalityTable;
