import VitalityTable from '../../../commons/components/VitalityTable.jsx';
import {
    buildCommonTableColumns,
    buildCommonTableDataSource,
} from '../../../commons/config/VitalityTableConfig.jsx';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper.jsx';
import GetAuditHelpListByPageAndParams from '../apis/getAuditHelpListByPageAndParams.js';

export default function VitalityAuditHelpListView() {
    const { translate } = useTranslation();

    return (
        <RefineTableWrapper
            title={translate('v6y-audit-helps.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'title',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getAuditHelpListByPageAndParams',
                query: GetAuditHelpListByPageAndParams,
            }}
            renderTable={(dataSource) => (
                <VitalityTable
                    dataSource={buildCommonTableDataSource(dataSource)}
                    columns={buildCommonTableColumns(dataSource, ['id'], {
                        enableEdit: true,
                        enableShow: true,
                        enableDelete: false,
                    })}
                />
            )}
        />
    );
}
