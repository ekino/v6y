import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView.jsx';
import { formatEvolutionHelpDetails } from '../../../commons/config/VitalityDetailsConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper.jsx';
import GetEvolutionHelpDetailsByParams from '../apis/getEvolutionHelpDetailsByParams.js';

export default function VitalityEvolutionHelpDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-evolution-helps.titles.show')}
                </Typography.Title>
            }
            queryOptions={{
                resource: 'getEvolutionHelpDetailsByParams',
                query: GetEvolutionHelpDetailsByParams,
                queryParams: {
                    evolutionHelpId: id,
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatEvolutionHelpDetails(translate, data)}
                    error={error}
                />
            )}
        />
    );
}
