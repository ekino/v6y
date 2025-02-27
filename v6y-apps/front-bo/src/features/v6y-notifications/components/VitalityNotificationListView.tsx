import { AdminListWrapper, useTranslationProvider } from '@v6y/ui-kit';
import type { DocumentNode } from 'graphql/index';

import VitalityTable from '../../../commons/components/VitalityTable';
import DeleteNotification from '../apis/deleteNotification';
import GetNotificationListByPageAndParams from '../apis/getNotificationListByPageAndParams';

export default function VitalityNotificationListView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminListWrapper
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
            renderContent={(dataSource) => (
                <VitalityTable
                    dataSource={dataSource}
                    columnKeys={[]}
                    columnOptions={{
                        enableEdit: true,
                        enableShow: true,
                        enableDelete: true,
                        deleteMetaQuery: {
                            gqlMutation: DeleteNotification as unknown as DocumentNode,
                            operation: 'deleteNotification',
                        },
                    }}
                />
            )}
        />
    );
}
