import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView.jsx';
import { formatApplicationDetails } from '../../../commons/config/VitalityDetailsConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper.jsx';
import GetAppDetailsInfosByParams from '../apis/getAppDetailsInfosByParams.js';

export default function VitalityApplicationDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-applications.titles.show')}
                </Typography.Title>
            }
            queryOptions={{
                resource: 'getAppDetailsInfosByParams',
                query: GetAppDetailsInfosByParams,
                queryParams: {
                    appId: id,
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatApplicationDetails(translate, data)}
                    error={error}
                />
            )}
        />
    );
}
