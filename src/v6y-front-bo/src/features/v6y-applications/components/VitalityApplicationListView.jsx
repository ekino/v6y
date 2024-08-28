import { useTable } from '@refinedev/antd';
import { Typography } from 'antd';

import VitalityTable from '../../../commons/components/VitalityTable.jsx';
import {
    buildTableColumns,
    buildTableDataSource,
} from '../../../commons/config/VitalityTableConfig.jsx';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import GetAppListByPageAndParams from '../apis/getAppListByPageAndParams.js';

export default function VitalityApplicationListView() {
    const { translate } = useTranslation();
    const { tableProps } = useTable({
        resource: 'getAppListByPageAndParams',
        meta: { gqlQuery: GetAppListByPageAndParams },
        initialSorter: [
            {
                field: 'name',
                order: 'asc',
            },
        ],
    });

    const { dataSource } = tableProps || {};

    return (
        <section>
            <Typography.Title level={2}>
                {translate('v6y-applications.titles.list')}
            </Typography.Title>
            <VitalityTable
                options={tableProps}
                dataSource={buildTableDataSource(dataSource)}
                columns={buildTableColumns(dataSource)}
            />
        </section>
    );
}
