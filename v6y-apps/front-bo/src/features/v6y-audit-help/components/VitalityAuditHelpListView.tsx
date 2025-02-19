import { useTranslationProvider } from '@v6y/shared-ui';

import RenderVitalityTable from '../../../commons/components/VitalityTable';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper';
import GetAuditHelpListByPageAndParams from '../apis/getAuditHelpListByPageAndParams';

export default function VitalityAuditHelpListView() {
    const { translate } = useTranslationProvider();

    return (
        <RefineTableWrapper
            title={translate('v6y-audit-helps.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'title',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getAuditHelpListByPageAndParams',
                query: GetAuditHelpListByPageAndParams,
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
