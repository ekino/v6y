import VitalityTable from '../../../commons/components/VitalityTable.jsx';
import {
    buildCommonTableColumns,
    buildCommonTableDataSource,
} from '../../../commons/config/VitalityTableConfig.jsx';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper.jsx';
import GetNotificationListByPageAndParams from '../apis/getNotificationListByPageAndParams.js';

export default function VitalityNotificationListView() {
    const { translate } = useTranslation();

    return (
        <RefineTableWrapper
            title={translate('v6y-notifications.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'name',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getNotificationListByPageAndParams',
                query: GetNotificationListByPageAndParams,
            }}
            renderTable={(dataSource) => (
                <VitalityTable
                    dataSource={buildCommonTableDataSource(dataSource)}
                    columns={buildCommonTableColumns(dataSource)}
                />
            )}
        />
    );
}
