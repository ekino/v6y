import { useParsed } from '@refinedev/core';
import { FaqType } from '@v6y/core-logic';
import { VitalityTitle } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView';
import { formatFaqDetails } from '../../../commons/config/VitalityDetailsConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper';
import GetFaqDetailsByParams from '../apis/getFaqDetailsByParams';

export default function VitalityFaqDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={<VitalityTitle title="v6y-faqs.titles.show" />}
            queryOptions={{
                resource: 'getFaqDetailsByParams',
                query: GetFaqDetailsByParams,
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView
                    details={formatFaqDetails(translate, data as FaqType)}
                    error={error}
                />
            )}
        />
    );
}
