import * as React from 'react';

import { DeprecatedDependencyType } from '@v6y/core-logic/src/types/DeprecatedDependencyType';
import AdminShowWrapper from '@v6y/ui-kit/components/organisms/admin/AdminShowWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useAdminNavigationParamsParser } from '@v6y/ui-kit/hooks/useAdminNavigationParamsParser';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatDeprecatedDependencyDetails } from '../../../commons/config/VitalityDetailsConfig';
import GetDeprecatedDependencyDetailsByParams from '../apis/getDeprecatedDependencyDetailsByParams';

export default function VitalityDeprecatedDependencyDetailsView() {
    const { translate } = useTranslationProvider();

    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminShowWrapper
            title={<TitleView title={translate('v6y-audit-helps.titles.show')} />}
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
