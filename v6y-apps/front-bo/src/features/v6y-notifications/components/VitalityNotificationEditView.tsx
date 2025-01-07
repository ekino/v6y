import { useParsed } from '@refinedev/core';
import * as React from 'react';

import VitalityTitle from '../../../commons/components/VitalityTitle';
import {
    notificationCreateEditItems,
    notificationCreateOrEditFormInAdapter,
    notificationCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper';
import CreateOrEditNotification from '../apis/createOrEditNotification';
import GetNotificationDetailsByParams from '../apis/getNotificationDetailsByParams';

export default function VitalityNotificationEditView() {
    const { translate } = useTranslation();
    const { id } = useParsed();

    return (
        <RefineEditWrapper
            title={<VitalityTitle title="v6y-notifications.titles.edit" />}
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
