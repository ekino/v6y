import { AuditHelpType } from '@v6y/core-logic';
import {
    AdminHttpError,
    AdminShowWrapper,
    VitalityTitle,
    useAdminNavigationParamsParser,
} from '@v6y/shared-ui';
import { useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatAuditHelpDetails } from '../../../commons/config/VitalityDetailsConfig';
import GetAuditHelpDetailsByParams from '../apis/getAuditHelpDetailsByParams';

export default function VitalityAuditHelpDetailsView() {
    const { translate } = useTranslationProvider();

    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminShowWrapper
            title={<VitalityTitle title={translate('v6y-audit-helps.titles.show')} />}
            queryOptions={{
                resource: 'getAuditHelpDetailsByParams',
                query: GetAuditHelpDetailsByParams,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={({ data, error }: { data?: unknown; error?: AdminHttpError }) => (
                <VitalityDetailsView
                    details={formatAuditHelpDetails(translate, data as AuditHelpType)}
                    error={error}
                />
            )}
        />
    );
}
