import * as React from 'react';

import VitalityTitle from '../../../commons/components/VitalityTitle';
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
            title={<VitalityTitle title="v6y-notifications.titles.create" />}
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
