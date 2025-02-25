import { DeprecatedDependencyType } from '@v6y/core-logic/src';
import { AdminShowWrapper, VitalityTitle, useAdminNavigationParamsParser } from '@v6y/shared-ui';
import { useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatDeprecatedDependencyDetails } from '../../../commons/config/VitalityDetailsConfig';
import GetDeprecatedDependencyDetailsByParams from '../apis/getDeprecatedDependencyDetailsByParams';

export default function VitalityDeprecatedDependencyDetailsView() {
    const { translate } = useTranslationProvider();

    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminShowWrapper
            title={<VitalityTitle title={translate('v6y-audit-helps.titles.show')} />}
            queryOptions={{
                resource: 'getDeprecatedDependencyDetailsByParams',
                query: GetDeprecatedDependencyDetailsByParams,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatDeprecatedDependencyDetails(
                        translate,
                        data as DeprecatedDependencyType,
                    )}
                    error={error}
                />
            )}
        />
    );
}
