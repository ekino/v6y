import * as React from 'react';

import { EvolutionHelpType } from '@v6y/core-logic/src/types/EvolutionHelpType';
import AdminShowWrapper from '@v6y/ui-kit/components/organisms/admin/AdminShowWrapper';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';
import { useAdminNavigationParamsParser } from '@v6y/ui-kit/hooks/useAdminNavigationParamsParser';
import { useTranslationProvider } from '@v6y/ui-kit/translation/useTranslationProvider';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatEvolutionHelpDetails } from '../../../commons/config/VitalityDetailsConfig';
import GetEvolutionHelpDetailsByParams from '../apis/getEvolutionHelpDetailsByParams';

export default function VitalityEvolutionHelpDetailsView() {
    const { translate } = useTranslationProvider();

    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminShowWrapper
            title={<TitleView title={translate('v6y-evolution-helps.titles.show')} />}
            queryOptions={{
                resource: 'getEvolutionHelpDetailsByParams',
                query: GetEvolutionHelpDetailsByParams,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatEvolutionHelpDetails(translate, data as EvolutionHelpType)}
                    error={error}
                />
            )}
        />
    );
}
