import { useTranslationProvider } from '@v6y/shared-ui';

import RenderVitalityTable from '../../../commons/components/VitalityTable';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper';
import DeleteDeprecatedDependency from '../apis/deleteDeprecatedDependency';
import GetDeprecatedDependencyListByPageAndParams from '../apis/getDeprecatedDependencyListByPageAndParams';

export default function VitalityDeprecatedDependencyListView() {
    const { translate } = useTranslationProvider();

    return (
        <RefineTableWrapper
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
            renderTable={(dataSource) => (
                <RenderVitalityTable
                    dataSource={dataSource}
                    columnKeys={['id']}
                    columnOptions={{
                        enableEdit: true,
                        enableShow: true,
                        enableDelete: true,
                        deleteMetaQuery: {
                            gqlMutation: DeleteDeprecatedDependency,
                            operation: 'deleteDeprecatedDependency',
                        },
                    }}
                />
            )}
        />
    );
}
