import VitalityTable from '../../../commons/components/VitalityTable.jsx';
import {
    buildApplicationTableColumns,
    buildApplicationTableDataSource,
} from '../../../commons/config/VitalityTableConfig.jsx';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper.jsx';
import GetApplicationList from '../apis/getApplicationList.js';

export default function VitalityApplicationListView() {
    const { translate } = useTranslation();

    return (
        <RefineTableWrapper
            title={translate('v6y-applications.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'name',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getApplicationListByPageAndParams',
                query: GetApplicationList,
            }}
            renderTable={(dataSource) => (
                <VitalityTable
                    dataSource={buildApplicationTableDataSource(dataSource)}
                    columns={buildApplicationTableColumns(dataSource)}
                />
            )}
        />
    );
}
