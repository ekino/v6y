import * as React from 'react';

import AdminEditWrapper from '@v6y/ui-kit/components/organisms/admin/AdminEditWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useAdminNavigationParamsParser } from '@v6y/ui-kit/hooks/useAdminNavigationParamsParser';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import {
    notificationCreateEditItems,
    notificationCreateOrEditFormInAdapter,
    notificationCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import CreateOrEditNotification from '../apis/createOrEditNotification';
import GetNotificationDetailsByParams from '../apis/getNotificationDetailsByParams';

export default function VitalityNotificationEditView() {
    const { translate } = useTranslationProvider();
    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminEditWrapper
            title={<TitleView title={translate('v6y-notifications.titles.edit')} />}
            queryOptions={{
                queryFormAdapter: notificationCreateOrEditFormInAdapter as (
                    data: unknown,
                ) => Record<string, unknown>,
                query: GetNotificationDetailsByParams,
                queryResource: 'getNotificationDetailsByParams',
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            mutationOptions={{
                editFormAdapter: notificationCreateOrEditFormOutputAdapter as (
                    data: unknown,
                ) => Record<string, unknown>,
                editQuery: CreateOrEditNotification,
                editQueryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            formItems={notificationCreateEditItems(translate)}
        />
    );
}
