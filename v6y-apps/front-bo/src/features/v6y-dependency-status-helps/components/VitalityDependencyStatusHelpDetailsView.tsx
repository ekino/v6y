import * as React from 'react';

import { DependencyStatusHelpType } from '@v6y/core-logic/src/types/DependencyStatusHelpType';
import AdminShowWrapper from '@v6y/ui-kit/components/organisms/admin/AdminShowWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useAdminNavigationParamsParser } from '@v6y/ui-kit/hooks/useAdminNavigationParamsParser';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatDependencyStatusHelpDetails } from '../../../commons/config/VitalityDetailsConfig';
import GetDependencyStatusHelpDetailsByParams from '../apis/getDependencyStatusHelpDetailsByParams';

export default function VitalityDependencyStatusHelpDetailsView() {
    const { translate } = useTranslationProvider();

    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminShowWrapper
            title={<TitleView title={translate('v6y-dependency-status-helps.titles.show')} />}
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
