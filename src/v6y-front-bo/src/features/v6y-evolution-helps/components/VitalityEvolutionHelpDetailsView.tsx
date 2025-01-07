import { useParsed } from '@refinedev/core';
import { EvolutionHelpType } from '@v6y/commons';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import VitalityTitle from '../../../commons/components/VitalityTitle';
import { formatEvolutionHelpDetails } from '../../../commons/config/VitalityDetailsConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import GetEvolutionHelpDetailsByParams from '../apis/getEvolutionHelpDetailsByParams';

export default function VitalityEvolutionHelpDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={<VitalityTitle title="v6y-evolution-helps.titles.show" />}
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
