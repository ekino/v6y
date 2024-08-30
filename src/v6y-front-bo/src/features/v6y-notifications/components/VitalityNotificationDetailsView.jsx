import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView.jsx';
import { formatNotificationDetails } from '../../../commons/config/VitalityDetailsConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper.jsx';
import GetNotificationDetails from '../../v6y-notifications/apis/getNotificationDetails.js';

export default function VitalityNotificationDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-notifications.titles.show')}
                </Typography.Title>
            }
            queryOptions={{
                resource: 'getNotificationDetailsInfosByParams',
                query: GetNotificationDetails,
                queryParams: {
                    notificationId: id,
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatNotificationDetails(translate, data)}
                    error={error}
                />
            )}
        />
    );
}
