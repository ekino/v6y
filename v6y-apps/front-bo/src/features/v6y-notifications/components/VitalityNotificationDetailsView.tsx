import { useParsed } from '@refinedev/core';
import { NotificationType } from '@v6y/core-logic/src';
import { VitalityTitle } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatNotificationDetails } from '../../../commons/config/VitalityDetailsConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import GetNotificationDetailsByParams from '../apis/getNotificationDetailsByParams';

export default function VitalityNotificationDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={<VitalityTitle title="v6y-notifications.titles.show" />}
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
