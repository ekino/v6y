import { HttpError, useParsed } from '@refinedev/core';
import { AuditHelpType } from '@v6y/core-logic';
import { Typography } from 'antd';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatAuditHelpDetails } from '../../../commons/config/VitalityDetailsConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import GetAuditHelpDetailsByParams from '../apis/getAuditHelpDetailsByParams';

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
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={({
                data,
                error,
            }: {
                data?: unknown;
                error: HttpError | string | undefined;
            }) => (
                <VitalityDetailsView
                    details={formatAuditHelpDetails(translate, data as AuditHelpType)}
                    error={error}
                />
            )}
        />
    );
}
