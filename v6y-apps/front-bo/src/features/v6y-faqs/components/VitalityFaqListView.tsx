import { useTranslationProvider } from '@v6y/shared-ui';

import RenderVitalityTable from '../../../commons/components/VitalityTable';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper';
import DeleteFaq from '../apis/deleteFaq';
import GetFaqListByPageAndParams from '../apis/getFaqListByPageAndParams';

export default function VitalityFaqListView() {
    const { translate } = useTranslationProvider();

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
                <RenderVitalityTable
                    dataSource={dataSource}
                    columnKeys={[]}
                    columnOptions={{
                        enableEdit: true,
                        enableShow: true,
                        enableDelete: true,
                        deleteMetaQuery: {
                            gqlMutation: DeleteFaq,
                            operation: 'deleteFaq',
                        },
                    }}
                />
            )}
        />
    );
}
