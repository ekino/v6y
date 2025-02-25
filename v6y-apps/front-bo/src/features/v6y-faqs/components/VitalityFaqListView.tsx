import { AdminTableWrapper, useTranslationProvider } from '@v6y/shared-ui';
import type { DocumentNode } from 'graphql/index';

import RenderVitalityTable from '../../../commons/components/VitalityTable';
import DeleteFaq from '../apis/deleteFaq';
import GetFaqListByPageAndParams from '../apis/getFaqListByPageAndParams';

export default function VitalityFaqListView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminTableWrapper
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
                            gqlMutation: DeleteFaq as unknown as DocumentNode,
                            operation: 'deleteFaq',
                        },
                    }}
                />
            )}
        />
    );
}
