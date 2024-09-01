import VitalityTable from '../../../commons/components/VitalityTable.jsx';
import {
    buildCommonTableColumns,
    buildCommonTableDataSource,
} from '../../../commons/config/VitalityTableConfig.jsx';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper.jsx';
import DeleteDependencyStatusHelp from '../apis/deleteDependencyStatusHelp.js';
import GetDependencyStatusHelpListByPageAndParams from '../apis/getDependencyStatusHelpListByPageAndParams.js';

export default function VitalityDependencyStatusHelpListView() {
    const { translate } = useTranslation();

    return (
        <RefineTableWrapper
            title={translate('v6y-evolution-helps.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'title',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getDependencyStatusHelpListByPageAndParams',
                query: GetDependencyStatusHelpListByPageAndParams,
            }}
            renderTable={(dataSource) => (
                <VitalityTable
                    dataSource={buildCommonTableDataSource(dataSource)}
                    columns={buildCommonTableColumns(dataSource, ['id'], {
                        gqlMutation: DeleteDependencyStatusHelp,
                        operation: 'deleteDependencyStatusHelp',
                    })}
                />
            )}
        />
    );
}
