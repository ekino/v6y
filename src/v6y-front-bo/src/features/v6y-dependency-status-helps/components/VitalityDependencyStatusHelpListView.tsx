import VitalityTable from '../../../commons/components/VitalityTable';
import {
    buildCommonTableColumns,
    buildCommonTableDataSource,
} from '../../../commons/config/VitalityTableConfig';
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
