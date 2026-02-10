import type { DocumentNode } from 'graphql/index';

import AdminListWrapper from '@v6y/ui-kit/components/organisms/admin/AdminListWrapper';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import VitalityTable from '../../../commons/components/VitalityTable';
import DeleteFaq from '../apis/deleteFaq';
import GetFaqListByPageAndParams from '../apis/getFaqListByPageAndParams';

export default function VitalityFaqListView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminListWrapper
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
            renderContent={(dataSource) => (
                <VitalityTable
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
