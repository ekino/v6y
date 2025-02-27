import { AdminCreateWrapper, TitleView, useTranslationProvider } from '@v6y/ui-kit';
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
            title={<TitleView title={translate('v6y-notifications.titles.create')} />}
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
