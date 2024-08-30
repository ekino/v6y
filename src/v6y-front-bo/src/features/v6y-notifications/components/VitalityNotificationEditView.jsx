import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import {
    notificationCreateEditItems,
    notificationCreateOrEditFormInAdapter,
    notificationCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper.jsx';
import CreateOrEditNotification from '../apis/createOrEditNotification.js';
import GetNotificationDetails from '../apis/getNotificationDetails.js';

export default function VitalityNotificationEditView() {
    const { translate } = useTranslation();
    const { id } = useParsed();

    return (
        <RefineEditWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-notifications.titles.edit')}
                </Typography.Title>
            }
            queryOptions={{
                queryFormAdapter: notificationCreateOrEditFormInAdapter,
                query: GetNotificationDetails,
                queryResource: 'getNotificationDetailsInfosByParams',
                queryParams: {
                    notificationId: id,
                },
            }}
            mutationOptions={{
                editFormAdapter: notificationCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditNotification,
                editQueryParams: {
                    notificationId: id,
                },
            }}
            formItems={notificationCreateEditItems(translate)}
        />
    );
}
