import { ApplicationType } from '@v6y/core-logic/src/types';
import { AdminListWrapper, useTranslationProvider } from '@v6y/shared-ui';
import type { DocumentNode } from 'graphql/index';

import GetApplicationListByPageAndParams from '../../../commons/apis/getApplicationListByPageAndParams';
import VitalityTable from '../../../commons/components/VitalityTable';
import DeleteApplication from '../apis/deleteApplication';

export default function VitalityApplicationListView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminListWrapper
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
            renderContent={(dataSource: ApplicationType[]) => (
                <VitalityTable
                    dataSource={dataSource}
                    columnKeys={[]}
                    columnOptions={{
                        enableEdit: true,
                        enableShow: true,
                        enableDelete: true,
                        deleteMetaQuery: {
                            gqlMutation: DeleteApplication as unknown as DocumentNode,
                            operation: 'deleteApplication',
                        },
                    }}
                />
            )}
        />
    );
}
