import AdminListWrapper from '@v6y/ui-kit/components/organisms/admin/AdminListWrapper';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import VitalityTable from '../../../commons/components/VitalityTable';
import GetAuditHelpListByPageAndParams from '../apis/getAuditHelpListByPageAndParams';

export default function VitalityAuditHelpListView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminListWrapper
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
