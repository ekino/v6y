import { DependencyStatusHelpType } from '@v6y/core-logic/src';
import { AdminShowWrapper, VitalityTitle, useAdminNavigationParamsParser } from '@v6y/shared-ui';
import { useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatDependencyStatusHelpDetails } from '../../../commons/config/VitalityDetailsConfig';
import GetDependencyStatusHelpDetailsByParams from '../apis/getDependencyStatusHelpDetailsByParams';

export default function VitalityDependencyStatusHelpDetailsView() {
    const { translate } = useTranslationProvider();

    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminShowWrapper
            title={<VitalityTitle title={translate('v6y-dependency-status-helps.titles.show')} />}
            queryOptions={{
                resource: 'getDependencyStatusHelpDetailsByParams',
                query: GetDependencyStatusHelpDetailsByParams,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatDependencyStatusHelpDetails(
                        translate,
                        data as DependencyStatusHelpType,
                    )}
                    error={error}
                />
            )}
        />
    );
}
