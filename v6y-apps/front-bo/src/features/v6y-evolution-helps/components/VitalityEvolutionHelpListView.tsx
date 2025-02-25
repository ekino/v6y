import { AdminTableWrapper, useTranslationProvider } from '@v6y/shared-ui';

import RenderVitalityTable from '../../../commons/components/VitalityTable';
import GetEvolutionHelpListByPageAndParams from '../apis/getEvolutionHelpListByPageAndParams';

export default function VitalityEvolutionHelpListView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminTableWrapper
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
            renderTable={(dataSource) => (
                <RenderVitalityTable
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
