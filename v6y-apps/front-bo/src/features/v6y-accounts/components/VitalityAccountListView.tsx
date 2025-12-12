import { DocumentNode } from 'graphql/index';

import { AdminListWrapper, useTranslationProvider } from '@v6y/ui-kit';

import VitalityTable from '../../../commons/components/VitalityTable';
import DeleteAccount from '../apis/deleteAccount';
import GetAccountListByPageAndParams from '../apis/getAccountListByPageAndParams';

export default function VitalityAccountListView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminListWrapper
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
            renderContent={(dataSource) => (
                <VitalityTable
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
