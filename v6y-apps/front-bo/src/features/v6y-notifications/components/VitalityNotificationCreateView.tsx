import { AdminCreateWrapper, VitalityTitle } from '@v6y/shared-ui';
import { useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import {
    notificationCreateEditItems,
    notificationCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import CreateOrEditNotification from '../../v6y-notifications/apis/createOrEditNotification';

export default function VitalityNotificationCreateView() {
    const { translate } = useTranslationProvider();

    return (
        <AdminCreateWrapper
            title={<VitalityTitle title={translate('v6y-notifications.titles.create')} />}
            createOptions={{
                createFormAdapter: notificationCreateOrEditFormOutputAdapter as (
                    data: unknown,
                ) => Record<string, unknown>,
                createQuery: CreateOrEditNotification,
                createQueryParams: {},
            }}
            formItems={notificationCreateEditItems(translate)}
        />
    );
}
