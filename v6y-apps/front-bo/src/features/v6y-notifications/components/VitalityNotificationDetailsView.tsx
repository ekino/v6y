import * as React from 'react';

import { NotificationType } from '@v6y/core-logic/src/types/NotificationType';
import AdminShowWrapper from '@v6y/ui-kit/components/organisms/admin/AdminShowWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useAdminNavigationParamsParser } from '@v6y/ui-kit/hooks/useAdminNavigationParamsParser';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

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
