import AdminListWrapper from '@v6y/ui-kit/components/organisms/admin/AdminListWrapper';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import VitalityTable from '../../../commons/components/VitalityTable';
import GetDependencyStatusHelpListByPageAndParams from '../apis/getDependencyStatusHelpListByPageAndParams';

export default function VitalityDependencyStatusHelpListView() {
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
                resource: 'getDependencyStatusHelpListByPageAndParams',
                query: GetDependencyStatusHelpListByPageAndParams,
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
