import {
    AdminEditWrapper,
    TitleView,
    useAdminNavigationParamsParser,
    useTranslationProvider,
} from '@v6y/ui-kit';
import * as React from 'react';

import {
    applicationCreateEditItems,
    applicationCreateOrEditFormInAdapter,
    applicationCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import CreateOrEditApplication from '../apis/createOrEditApplication';
import GetApplicationDetails from '../apis/getApplicationDetails';

export default function VitalityApplicationEditView() {
    const { translate } = useTranslationProvider();
    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminEditWrapper
            title={<TitleView title={translate('v6y-applications.titles.edit')} />}
            queryOptions={{
                queryFormAdapter: applicationCreateOrEditFormInAdapter as (
                    data: unknown,
                ) => Record<string, unknown>,
                query: GetApplicationDetails,
                queryResource: 'getApplicationDetailsInfoByParams',
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            mutationOptions={{
                resource: 'createOrEditApplication',
                editFormAdapter: applicationCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditApplication,
                editQueryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            formItems={applicationCreateEditItems(translate)}
        />
    );
}
