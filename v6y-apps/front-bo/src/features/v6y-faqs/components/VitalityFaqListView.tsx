import VitalityTable from '../../../commons/components/VitalityTable';
import {
    buildCommonTableColumns,
    buildCommonTableDataSource,
} from '../../../commons/config/VitalityTableConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper';
import DeleteFaq from '../apis/deleteFaq';
import GetFaqListByPageAndParams from '../apis/getFaqListByPageAndParams';

export default function VitalityFaqListView() {
    const { translate } = useTranslation();

    return (
        <RefineTableWrapper
            title={translate('v6y-faqs.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'title',
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
                    columns={buildCommonTableColumns(dataSource, [], {
                        enableEdit: true,
                        enableShow: true,
                        enableDelete: true,
                        deleteMetaQuery: {
                            gqlMutation: DeleteFaq,
                            operation: 'deleteFaq',
                        },
                    })}
                />
            )}
        />
    );
}
