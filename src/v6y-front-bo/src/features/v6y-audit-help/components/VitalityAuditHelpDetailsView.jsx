import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView.jsx';
import { formatAuditHelpDetails } from '../../../commons/config/VitalityDetailsConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper.jsx';
import GetAuditHelpDetailsByParams from '../apis/getAuditHelpDetailsByParams.js';


export default function VitalityAuditHelpDetailsView() {
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
                resource: 'getAuditHelpDetailsByParams',
                query: GetAuditHelpDetailsByParams,
                queryParams: {
                    auditHelpId: id,
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatAuditHelpDetails(translate, data)}
                    error={error}
                />
            )}
        />
    );
}
