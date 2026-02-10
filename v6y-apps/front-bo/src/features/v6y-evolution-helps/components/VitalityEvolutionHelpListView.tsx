import AdminListWrapper from '@v6y/ui-kit/components/organisms/admin/AdminListWrapper';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import VitalityTable from '../../../commons/components/VitalityTable';
import GetEvolutionHelpListByPageAndParams from '../apis/getEvolutionHelpListByPageAndParams';

export default function VitalityEvolutionHelpListView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminListWrapper
            title={translate('v6y-evolution-helps.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'title',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getEvolutionHelpListByPageAndParams',
                query: GetEvolutionHelpListByPageAndParams,
            }}
            renderContent={(dataSource) => (
                <VitalityTable
                    dataSource={dataSource}
                    columnKeys={['id']}
                    columnOptions={{
                        enableEdit: true,
                        enableShow: true,
                        enableDelete: false,
                    }}
                />
            )}
        />
    );
}
