import { useParsed } from '@refinedev/core';
import { EvolutionHelpType } from '@v6y/core-logic';
import { Typography } from 'antd';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatEvolutionHelpDetails } from '../../../commons/config/VitalityDetailsConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import GetEvolutionHelpDetailsByParams from '../apis/getEvolutionHelpDetailsByParams';

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
