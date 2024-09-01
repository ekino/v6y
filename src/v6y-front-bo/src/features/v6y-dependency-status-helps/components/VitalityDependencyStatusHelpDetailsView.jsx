import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView.jsx';
import { formatDependencyStatusHelpDetails } from '../../../commons/config/VitalityDetailsConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper.jsx';
import GetDependencyStatusHelpDetailsByParams from '../apis/getDependencyStatusHelpDetailsByParams.js';

export default function VitalityDependencyStatusHelpDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-dependency-status-helps.titles.show')}
                </Typography.Title>
            }
            queryOptions={{
                resource: 'getDependencyStatusHelpDetailsByParams',
                query: GetDependencyStatusHelpDetailsByParams,
                queryParams: {
                    dependencyStatusHelpId: id,
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatDependencyStatusHelpDetails(translate, data)}
                    error={error}
                />
            )}
        />
    );
}
