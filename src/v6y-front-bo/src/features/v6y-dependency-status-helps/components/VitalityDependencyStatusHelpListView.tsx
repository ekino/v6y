import RenderVitalityTable from '../../../commons/components/RenderVitalityTable';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper';
import GetDependencyStatusHelpListByPageAndParams from '../apis/getDependencyStatusHelpListByPageAndParams';

export default function VitalityDependencyStatusHelpListView() {
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
                resource: 'getDependencyStatusHelpListByPageAndParams',
                query: GetDependencyStatusHelpListByPageAndParams,
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
