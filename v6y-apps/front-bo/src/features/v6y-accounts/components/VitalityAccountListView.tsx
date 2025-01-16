import RenderVitalityTable from '../../../commons/components/VitalityTable';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper';
import DeleteAccount from '../apis/deleteAccount';
import GetAccountListByPageAndParams from '../apis/getAccountListByPageAndParams';

export default function VitalityAccountListView() {
    const { translate } = useTranslation();

    return (
        <RefineTableWrapper
            title={translate('v6y-accounts.titles.list')}
            subTitle=""
            defaultSorter={[
                {
                    field: 'title',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getAccountListByPageAndParams',
                query: GetAccountListByPageAndParams,
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
                            gqlMutation: DeleteAccount,
                            operation: 'deleteAccount',
                        },
                    }}
                />
            )}
        />
    );
}
