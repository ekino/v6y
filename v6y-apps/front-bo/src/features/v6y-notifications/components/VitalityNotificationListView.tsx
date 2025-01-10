import VitalityTable from '../../../commons/components/VitalityTable';
import {
    buildCommonTableColumns,
    buildCommonTableDataSource,
} from '../../../commons/config/VitalityTableConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper';
import DeleteNotification from '../apis/deleteNotification';
import GetNotificationListByPageAndParams from '../apis/getNotificationListByPageAndParams';

export default function VitalityNotificationListView() {
    const { translate } = useTranslation();

    return (
        <RefineTableWrapper
            title={translate('v6y-notifications.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'title',
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
                    columns={buildCommonTableColumns(dataSource, [], {
                        enableEdit: true,
                        enableShow: true,
                        enableDelete: true,
                        deleteMetaQuery: {
                            gqlMutation: DeleteNotification,
                            operation: 'deleteNotification',
                        },
                    })}
                />
            )}
        />
    );
}
