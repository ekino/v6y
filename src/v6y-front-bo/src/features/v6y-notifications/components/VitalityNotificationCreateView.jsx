import { Typography } from 'antd';
import React from 'react';

import {
    notificationCreateEditItems,
    notificationCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineCreateWrapper from '../../../infrastructure/components/RefineCreateWrapper.jsx';
import CreateOrEditNotification from '../../v6y-notifications/apis/createOrEditNotification.js';

export default function VitalityNotificationCreateView() {
    const { translate } = useTranslation();

    return (
        <RefineCreateWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-notifications.titles.create')}
                </Typography.Title>
            }
            createOptions={{
                createFormAdapter: notificationCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditNotification,
                createQueryParams: {},
            }}
            formItems={notificationCreateEditItems(translate)}
        />
    );
}
