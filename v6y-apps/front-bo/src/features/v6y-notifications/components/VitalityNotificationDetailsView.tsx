import { NotificationType } from '@v6y/core-logic/src/types';
import {
    AdminShowWrapper,
    TitleView,
    useAdminNavigationParamsParser,
    useTranslationProvider,
} from '@v6y/ui-kit';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatNotificationDetails } from '../../../commons/config/VitalityDetailsConfig';
import GetNotificationDetailsByParams from '../apis/getNotificationDetailsByParams';

export default function VitalityNotificationDetailsView() {
    const { translate } = useTranslationProvider();

    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminShowWrapper
            title={<TitleView title={translate('v6y-notifications.titles.show')} />}
            queryOptions={{
                resource: 'getNotificationDetailsByParams',
                query: GetNotificationDetailsByParams,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatNotificationDetails(translate, data as NotificationType)}
                    error={error}
                />
            )}
        />
    );
}
