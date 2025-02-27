import { AdminListWrapper, useTranslationProvider } from '@v6y/shared-ui';
import type { DocumentNode } from 'graphql/index';

import VitalityTable from '../../../commons/components/VitalityTable';
import DeleteDeprecatedDependency from '../apis/deleteDeprecatedDependency';
import GetDeprecatedDependencyListByPageAndParams from '../apis/getDeprecatedDependencyListByPageAndParams';

export default function VitalityDeprecatedDependencyListView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminListWrapper
            title={translate('v6y-deprecated-dependencies.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'label',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getDeprecatedDependencyListByPageAndParams',
                query: GetDeprecatedDependencyListByPageAndParams,
            }}
            renderContent={(dataSource) => (
                <VitalityTable
                    dataSource={dataSource}
                    columnKeys={['id']}
                    columnOptions={{
                        enableEdit: true,
                        enableShow: true,
                        enableDelete: true,
                        deleteMetaQuery: {
                            gqlMutation: DeleteDeprecatedDependency as unknown as DocumentNode,
                            operation: 'deleteDeprecatedDependency',
                        },
                    }}
                />
            )}
        />
    );
}
