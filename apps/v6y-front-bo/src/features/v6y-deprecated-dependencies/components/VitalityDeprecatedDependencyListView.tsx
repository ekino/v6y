import VitalityTable from '../../../commons/components/VitalityTable';
import {
    buildCommonTableColumns,
    buildCommonTableDataSource,
} from '../../../commons/config/VitalityTableConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper';
import DeleteDeprecatedDependency from '../apis/deleteDeprecatedDependency';
import GetDeprecatedDependencyListByPageAndParams from '../apis/getDeprecatedDependencyListByPageAndParams';

export default function VitalityDeprecatedDependencyListView() {
    const { translate } = useTranslation();

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
                <VitalityTable
                    dataSource={buildCommonTableDataSource(dataSource)}
                    columns={buildCommonTableColumns(dataSource, ['id'], {
                        enableEdit: true,
                        enableShow: true,
                        enableDelete: true,
                        deleteMetaQuery: {
                            gqlMutation: DeleteDeprecatedDependency,
                            operation: 'deleteDeprecatedDependency',
                        },
                    })}
                />
            )}
        />
    );
}
