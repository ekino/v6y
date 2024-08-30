import VitalityTable from '../../../commons/components/VitalityTable.jsx';
import {
    buildCommonTableColumns,
    buildCommonTableDataSource,
} from '../../../commons/config/VitalityTableConfig.jsx';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper.jsx';
import GetNotificationList from '../apis/getNotificationList.js';

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
                query: GetNotificationList,
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
