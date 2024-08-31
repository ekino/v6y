import VitalityTable from '../../../commons/components/VitalityTable.jsx';
import {
    buildCommonTableColumns,
    buildCommonTableDataSource,
} from '../../../commons/config/VitalityTableConfig.jsx';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper.jsx';
import GetFaqListByPageAndParams from '../apis/getFaqListByPageAndParams.js';

export default function VitalityFaqListView() {
    const { translate } = useTranslation();

    return (
        <RefineTableWrapper
            title={translate('v6y-faqs.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'name',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getFaqListByPageAndParams',
                query: GetFaqListByPageAndParams,
            }}
            renderTable={(dataSource) => (
                <VitalityTable
                    dataSource={buildCommonTableDataSource(dataSource)}
                    columns={buildCommonTableColumns(dataSource)}
                />
            )}
        />
    );
}
