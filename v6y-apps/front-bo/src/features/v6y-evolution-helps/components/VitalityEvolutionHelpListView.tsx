import RenderVitalityTable from '../../../commons/components/RenderVitalityTable';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper';
import GetEvolutionHelpListByPageAndParams from '../apis/getEvolutionHelpListByPageAndParams';

export default function VitalityEvolutionHelpListView() {
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
