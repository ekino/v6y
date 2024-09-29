import { Typography } from 'antd';
import * as React from 'react';

import {
    notificationCreateEditItems,
    notificationCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineCreateWrapper from '../../../infrastructure/components/RefineCreateWrapper';
import CreateOrEditNotification from '../../v6y-notifications/apis/createOrEditNotification';

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
