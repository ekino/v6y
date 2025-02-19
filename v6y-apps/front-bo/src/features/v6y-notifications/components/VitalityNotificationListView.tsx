import { useTranslationProvider } from '@v6y/shared-ui';

import RenderVitalityTable from '../../../commons/components/VitalityTable';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper';
import DeleteNotification from '../apis/deleteNotification';
import GetNotificationListByPageAndParams from '../apis/getNotificationListByPageAndParams';

export default function VitalityNotificationListView() {
    const { translate } = useTranslationProvider();

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
                <RenderVitalityTable
                    dataSource={dataSource}
                    columnKeys={[]}
                    columnOptions={{
                        enableEdit: true,
                        enableShow: true,
                        enableDelete: true,
                        deleteMetaQuery: {
                            gqlMutation: DeleteNotification,
                            operation: 'deleteNotification',
                        },
                    }}
                />
            )}
        />
    );
}
