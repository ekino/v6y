import VitalityTable from '../../../commons/components/VitalityTable.jsx';
import {
    buildCommonTableColumns,
    buildCommonTableDataSource,
} from '../../../commons/config/VitalityTableConfig.jsx';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper.jsx';
import DeleteApplication from '../apis/deleteApplication.js';
import GetApplicationList from '../apis/getApplicationList.js';

export default function VitalityApplicationListView() {
    const { translate } = useTranslation();

    return (
        <RefineTableWrapper
            title={translate('v6y-applications.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'acronym',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getApplicationListByPageAndParams',
                query: GetApplicationList,
            }}
            renderTable={(dataSource) => (
                <VitalityTable
                    dataSource={buildCommonTableDataSource(dataSource)}
                    columns={buildCommonTableColumns(dataSource, [], {
                        gqlMutation: DeleteApplication,
                        operation: 'deleteApplication',
                    })}
                />
            )}
        />
    );
}
