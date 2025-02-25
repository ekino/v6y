import { AdminTableWrapper, useTranslationProvider } from '@v6y/shared-ui';
import { DocumentNode } from 'graphql/index';

import RenderVitalityTable from '../../../commons/components/VitalityTable';
import DeleteAccount from '../apis/deleteAccount';
import GetAccountListByPageAndParams from '../apis/getAccountListByPageAndParams';

export default function VitalityAccountListView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminTableWrapper
            title={translate('v6y-accounts.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'title',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getAccountListByPageAndParams',
                query: GetAccountListByPageAndParams,
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
                            gqlMutation: DeleteAccount as unknown as DocumentNode,
                            operation: 'deleteAccount',
                        },
                    }}
                />
            )}
        />
    );
}
