import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import VitalityDetailsView from '../../../commons/components/VitalityDetailsView.jsx';
import { formatFaqDetails } from '../../../commons/config/VitalityDetailsConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineShowWrapper from '../../../infrastructure/components/RefineShowWrapper.jsx';
import GetFaqDetailsByParams from '../apis/getFaqDetailsByParams.js';


export default function VitalityFaqDetailsView() {
    const { translate } = useTranslation();

    const { id } = useParsed();

    return (
        <RefineShowWrapper
            title={
                <Typography.Title level={2}>{translate('v6y-faqs.titles.show')}</Typography.Title>
            }
            queryOptions={{
                resource: 'getFaqDetailsByParams',
                query: GetFaqDetailsByParams,
                queryParams: {
                    faqId: id,
                },
            }}
            renderShowView={({ data, error }) => (
                <VitalityDetailsView details={formatFaqDetails(translate, data)} error={error} />
            )}
        />
    );
}
