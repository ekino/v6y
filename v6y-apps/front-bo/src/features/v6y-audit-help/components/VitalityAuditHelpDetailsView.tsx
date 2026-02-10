import * as React from 'react';

import { AuditHelpType } from '@v6y/core-logic/src/types/AuditHelpType';
import { AdminHttpError } from '@v6y/ui-kit/api/types/AdminHttpError';
import AdminShowWrapper from '@v6y/ui-kit/components/organisms/admin/AdminShowWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useAdminNavigationParamsParser } from '@v6y/ui-kit/hooks/useAdminNavigationParamsParser';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatAuditHelpDetails } from '../../../commons/config/VitalityDetailsConfig';
import GetAuditHelpDetailsByParams from '../apis/getAuditHelpDetailsByParams';

export default function VitalityAuditHelpDetailsView() {
    const { translate } = useTranslationProvider();

    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminShowWrapper
            title={<TitleView title={translate('v6y-audit-helps.titles.show')} />}
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
