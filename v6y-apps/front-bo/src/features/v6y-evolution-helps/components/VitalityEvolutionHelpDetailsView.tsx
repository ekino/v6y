import { EvolutionHelpType } from '@v6y/core-logic';
import { AdminShowWrapper, VitalityTitle, useAdminNavigationParamsParser } from '@v6y/shared-ui';
import { useTranslationProvider } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatEvolutionHelpDetails } from '../../../commons/config/VitalityDetailsConfig';
import GetEvolutionHelpDetailsByParams from '../apis/getEvolutionHelpDetailsByParams';

export default function VitalityEvolutionHelpDetailsView() {
    const { translate } = useTranslationProvider();

    const { id } = useAdminNavigationParamsParser();

    return (
        <AdminShowWrapper
            title={<VitalityTitle title={translate('v6y-evolution-helps.titles.show')} />}
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
