import VitalityTable from '../../../commons/components/VitalityTable.jsx';
import {
    buildTableColumns,
    buildTableDataSource,
} from '../../../commons/config/VitalityTableConfig.jsx';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper.jsx';
import GetAppListByPageAndParams from '../apis/getAppListByPageAndParams.js';

export default function VitalityApplicationListView() {
    const { translate } = useTranslation();

    return (
        <RefineTableWrapper
            title={translate('v6y-applications.titles.list')}
            defaultSorter={[
                {
                    field: 'name',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getAppListByPageAndParams',
                query: GetAppListByPageAndParams,
            }}
            renderTable={(dataSource) => (
                <VitalityTable
                    dataSource={buildTableDataSource(dataSource)}
                    columns={buildTableColumns(dataSource)}
                />
            )}
        />
    );
}
