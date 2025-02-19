import { HttpError, useParsed } from '@refinedev/core';
import { AuditHelpType } from '@v6y/core-logic';
import { VitalityTitle } from '@v6y/shared-ui';
import { useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatAuditHelpDetails } from '../../../commons/config/VitalityDetailsConfig';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import GetAuditHelpDetailsByParams from '../apis/getAuditHelpDetailsByParams';

export default function VitalityAuditHelpDetailsView() {
    const { translate } = useTranslationProvider();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={<VitalityTitle title="v6y-audit-helps.titles.show" />}
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
