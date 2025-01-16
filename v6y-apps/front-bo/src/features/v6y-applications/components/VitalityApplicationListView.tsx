import { ApplicationType } from '@v6y/core-logic';

import GetApplicationListByPageAndParams from '../../../commons/apis/getApplicationListByPageAndParams';
import RenderVitalityTable from '../../../commons/components/VitalityTable';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineTableWrapper from '../../../infrastructure/components/RefineTableWrapper';
import DeleteApplication from '../apis/deleteApplication';

export default function VitalityApplicationListView() {
    const { translate } = useTranslation();

    return (
        <RefineTableWrapper
            title={translate('v6y-applications.titles.list') || ''}
            subTitle=""
            defaultSorter={[
                {
                    field: 'acronym',
                    order: 'asc',
                },
            ]}
            queryOptions={{
                resource: 'getApplicationListByPageAndParams',
                query: GetApplicationListByPageAndParams,
            }}
            renderTable={(dataSource: ApplicationType[]) => (
                <RenderVitalityTable
                    dataSource={dataSource}
                    columnKeys={[]}
                    columnOptions={{
                        enableEdit: true,
                        enableShow: true,
                        enableDelete: true,
                        deleteMetaQuery: {
                            gqlMutation: DeleteApplication,
                            operation: 'deleteApplication',
                        },
                    }}
                />
            )}
        />
    );
}
