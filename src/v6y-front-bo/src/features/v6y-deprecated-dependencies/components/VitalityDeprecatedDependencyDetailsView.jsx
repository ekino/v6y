import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView.jsx';
import { formatDeprecatedDependencyDetails } from '../../../commons/config/VitalityDetailsConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper.jsx';
import GetDeprecatedDependencyDetailsByParams from '../apis/getDeprecatedDependencyDetailsByParams.js';

export default function VitalityDeprecatedDependencyDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-audit-helps.titles.show')}
                </Typography.Title>
            }
            queryOptions={{
                resource: 'getDeprecatedDependencyDetailsByParams',
                query: GetDeprecatedDependencyDetailsByParams,
                queryParams: {
                    deprecatedDependencyId: id,
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatDeprecatedDependencyDetails(translate, data)}
                    error={error}
                />
            )}
        />
    );
}
